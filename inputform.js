import wixUsers from "wix-users";
import wixWindow from "wix-window";
import wixData from "wix-data";

$w.onReady(function () {

    // 🔹 Function to enable/disable submit button
    function updateSubmitButtonState() {
        const title = $w("#inputTitle").value.trim();
        const category = $w("#dropdownInputCategory").value;
        let content = $w("#richTextBoxInputComment").value;

        // Treat rich text box as empty if it only contains an empty paragraph
        if (!content || content === "<p><br></p>") content = "";

        if (title && category && content) {
            $w("#btnCommunityInputSubmit").enable();
        } else {
            $w("#btnCommunityInputSubmit").disable();
        }
    }

    // 🔹 Initial button state
    $w("#btnCommunityInputSubmit").disable();

    // 🔹 Add listeners to required fields
    $w("#inputTitle").onInput(updateSubmitButtonState);
    $w("#dropdownInputCategory").onChange(updateSubmitButtonState);
    $w("#richTextBoxInputComment").onChange(updateSubmitButtonState);

    // 🔹 Submit comment to collection
    $w("#btnCommunityInputSubmit").onClick(() => {
        const title = $w("#inputTitle").value.trim();
        const category = $w("#dropdownInputCategory").value;
        const content = $w("#richTextBoxInputComment").value;
        const authorName = $w("#inputName").value;
        const rawTags = $w("#tagsInput").value.trim();
        const tagsArray = rawTags ? rawTags.split(",").map(tag => tag.trim()).filter(tag => tag) : [];
    
        if (!title || !category || !content || content === "<p><br></p>") {
            console.warn("Please fill in all required fields.");
            return;
        }
    
        const isAnonymous = !wixUsers.currentUser.loggedIn;
    
        // --- New logic starts here ---
        // Check if the user selected a file to upload
            // If no file was selected, run the original code
            const newComment = { title, category, content, authorName, tags: tagsArray, isAnonymous };
    
            wixData.insert("CommentsCollection", newComment)
                .then(() => {
                    console.log("Comment saved:", newComment);
                    // Clear form inputs
                    $w("#inputTitle").value = "";
                    $w("#dropdownInputCategory").value = "";
                    $w("#richTextBoxInputComment").value = "";
                    $w("#inputName").value = "";
                    $w("#tagsInput").value = "";
    
                    updateSubmitButtonState();
                    wixWindow.lightbox.close("CommunityLogInput");
                    wixWindow.openLightbox("CL_CommentSuccessPopup");
                })
                .catch((err) => console.error("Error saving comment:", err));
        }
    )
});
