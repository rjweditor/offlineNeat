# offlineNeat - Adobe Premiere Pro Missing Media Script

**offlineNeat** is a script written in ExtendScript that helps identify offline (missing) media in an Adobe Premiere Pro project. It recursively checks all project items, including nested bins, and outputs the names of the missing media files to a `.txt` file.

## Features
- Recursively searches for offline media in a Premiere Pro project, including media in nested bins.
- Outputs the names of missing media to a text file on your desktop.

## Requirements
- **Adobe Premiere Pro** (with ExtendScript support).
- **VS Code** with the **ExtendScript Debugger** extension installed.

## Setup

### 1. Install ExtendScript Debugger in VS Code:
   - Open VS Code.
   - Navigate to the **Extensions** panel (or press `Ctrl + Shift + X`).
   - Search for and install the **ExtendScript Debugger** extension by Adobe.

### 2. Set Up ExtendScript Toolkit (If Required):
   - Depending on your Premiere Pro version, you may need Adobe's ExtendScript Toolkit (ESTK).
   - You can download ESTK from [Adobe's download page](https://www.adobe.com/devnet/scripting/estk.html).

## Usage

### Step 1: Set Up the Script

1. Create a new file in your project directory named `offlineNeat.js`.
2. Copy the following script into that file:

```javascript
// offlineNeat - Adobe Premiere Pro Missing Media Script
var project = app.project;
var missingMedia = [];

// Define the file path for the output text file
var outputFile = File("~/Desktop/missing_media.txt"); // You can specify the path here

// Open the file for writing
outputFile.open("w"); // "w" for write mode

// Recursive function to check all items in a bin (or project root)
function checkForMissingMedia(item) {
    if (item.children && item.children.length > 0) {
        // If the item is a bin, recursively check its children
        for (var i = 0; i < item.children.length; i++) {
            checkForMissingMedia(item.children[i]);
        }
    } else {
        // If the item is a clip, check its offline status
        if (item.type == ProjectItemType.CLIP && item.isOffline()) {
            missingMedia.push(item.name);
        }
    }
}

// Start by checking the root item
checkForMissingMedia(project.rootItem);

// Write missing media file names to the text document
if (missingMedia.length > 0) {
    for (var j = 0; j < missingMedia.length; j++) {
        outputFile.writeln("Missing media: " + missingMedia[j]);
    }
    $.writeln("Missing media has been written to the file.");
} else {
    $.writeln("No missing media found.");
}

// Close the file after writing
outputFile.close();
```

### Step 2: Configure VS Code to Debug ExtendScript

1. Open **VS Code** and your project folder where `offlineNeat.js` is located.
2. Press `Ctrl + Shift + P` (or `Cmd + Shift + P` on macOS) to open the command palette.
3. Type **`Debug: Open launch.json`** and select it to create a new debug configuration file.
4. Choose **ExtendScript Debugger** from the list of environments.
5. VS Code will create a `launch.json` file under the `.vscode` folder with the basic configuration.
6. Modify the `launch.json` configuration to target Adobe Premiere Pro:

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "extendscript-debug",
            "request": "launch",
            "name": "Debug ExtendScript in Adobe Premiere Pro",
            "program": "${workspaceFolder}/offlineNeat.js",
            "targetSpecifier": "PremierePro"
        }
    ]
}
```

### Step 3: Debug the Script

1. In VS Code, open the **Run and Debug** panel (or press `Ctrl + Shift + D`).
2. Select **Debug ExtendScript in Adobe Premiere Pro** from the dropdown list.
3. Click the green **Start Debugging** button (or press `F5`).
4. Premiere Pro will open, and the script will run. It will analyze the project for missing media and output the results into a `.txt` file on your Desktop.

### Step 4: Check the Output

- After the script runs, you will find a file named `missing_media.txt` on your desktop.
- This file will contain a list of all media files that are missing from the current Premiere Pro project.

## Troubleshooting

- Ensure that your Premiere Pro project is open before running the script.
- If the script doesn't find any missing media, double-check that the project actually contains offline files.
- You can enable verbose logging by adding debug statements to the script, such as:
  ```javascript
  $.writeln("Checking item: " + item.name);
  ```

## License
This script is open-source and distributed under the MIT License.
