// Open ExtendScript Toolkit and run this script
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
