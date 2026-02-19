import wixData from 'wix-data';
import { local } from 'wix-storage';
import wixLocation from 'wix-location-frontend';

// --- CONFIGURATION: BUTTON COLORS ---
// You can change these hex codes to match your design
const COLOR_ACTIVE = "#20B2AA";   // Teal (When selected)
const COLOR_DEFAULT = "#FFFFFF";  // White (Normal state)
const COLOR_TEXT_ACTIVE = "#FFFFFF"; // White text on colored button
const COLOR_TEXT_DEFAULT = "#000000"; // Black text on white button

$w.onReady(function () {
    
    // Wait for the dataset to load the current item details
    $w("#dynamicDataset").onReady(() => {

        $w("#dynamicDataset").onReady(() => {
            const currentItem = $w("#dynamicDataset").getCurrentItem();
        
           // Replace with your actual Field Key
          const pageUrl = currentItem['link-commentscollection-title']; 
        
        if (pageUrl) {
            setupSocialSharing(pageUrl);
        }
    });

    function setupSocialSharing(pageUrl) {
    
        // 1. Construct the Base URL
        const fullUrl = wixLocation.baseUrl + pageUrl;
        
        // 2. Get the Name (Title) for the tweet
        // We grab the name from the dataset directly to ensure it's accurate
        const currentItem = $w("#dynamicDataset").getCurrentItem();
        const title = currentItem.title; // Replace 'title' if your field key is different
        
        // --- X (Twitter) Logic (UPDATED) ---
        // Old way: quote
        // New way: "Name endorses Ace Parsi"
        const tweetText = encodeURIComponent(`${title} on Community Post`);
        
        // The final URL looks like: Text + URL
        const twitterUrl = `https://twitter.com/intent/tweet?text=${tweetText}&url=${fullUrl}`;
        
        $w("#btnX").link = twitterUrl;
        $w("#btnX").target = "_blank";


        // --- Facebook Logic (Stays the Same) ---
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`;
        $w("#btnFacebook").link = facebookUrl;
        $w("#btnFacebook").target = "_blank";


        // --- LinkedIn Logic (Stays the Same) ---
        const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}`;
        $w("#btnLinkedIn").link = linkedInUrl;
        $w("#btnLinkedIn").target = "_blank";

    }
        
        // 1. Get the current item's data
        const item = $w("#dynamicDataset").getCurrentItem();

        const staffComment = item.staffComment; // Get the text from the database

    // Check if the comment exists and is not just an empty space
    if (staffComment && staffComment.length > 2) {
        // CASE: There IS a staff comment
        $w("#staffCommentsBox").expand(); // Show the comment box
        $w("#noCommentsBox").collapse();  // Remove the "No Comments" warning
    } else {
        // CASE: The field is empty (No comment)
        $w("#staffCommentsBox").collapse(); // Remove the comment box
        $w("#noCommentsBox").expand();      // Show the "No Comments" warning
    }
        
        // 2. Get the category text (Safety check: ensure it exists)
        const category = item.category || ""; 

        // 3. Define the element to color
        const pillBox = $w("#categoryPillBox");

        // 4. Run the color logic
        // We use a "switch" statement which is cleaner than many "if/else" blocks
        switch (category) {
            
            case "Transportation & Mobility":
                pillBox.style.backgroundColor = "#D7CCC8"; // Soft Brown
                break;

            case "Land Use & Development":
                pillBox.style.backgroundColor = "#90CAF9"; // Soft Blue
                break;

            case "Community Services & Well-Being":
                pillBox.style.backgroundColor = "#FFCC80"; // Soft Orange
                break;

            case "Economy & Local Business":
                pillBox.style.backgroundColor = "#FFF59D"; // Soft Yellow
                break;

            case "Environment & Public Spaces":
                pillBox.style.backgroundColor = "#A5D6A7"; // Soft Green
                break;

            default:
                // Fallback color if category is missing or doesn't match (Light Gray)
                pillBox.style.backgroundColor = "#EEEEEE"; 
                break;
        }


        // 1. INITIALIZE: Draw the bar with current database values
        // We use || 0 to ensure we don't pass 'undefined' if fields are empty
        updateVoteBar(item.likes || 0, item.dislikes || 0);

        // 2. CHECK STORAGE: Has this user voted before?
        const storageKey = "vote_" + item._id;
        const savedVote = local.getItem(storageKey);

        // 3. SET INITIAL BUTTON STATE
        if (savedVote === 'liked') {
            setButtonState('agree');
        } else if (savedVote === 'disliked') {
            setButtonState('disagree');
        } else {
            setButtonState('reset');
        }

        // 4. CLICK HANDLERS
        $w("#btnAgree").onClick(() => handleVote('likes'));
        $w("#btnDisagree").onClick(() => handleVote('dislikes'));
    });

});

/**
 * LOGIC: Handles the math and saving
 */
async function handleVote(voteType) {
    const dataset = $w("#dynamicDataset");
    let item = dataset.getCurrentItem();
    const storageKey = "vote_" + item._id;
    const currentVote = local.getItem(storageKey);

    // Sanitize numbers (treat nulls as 0)
    item.likes = item.likes || 0;
    item.dislikes = item.dislikes || 0;

    // --- LOGIC GUARD ---
    // Prevent clicking "Disagree" if currently "Agreed" (must unvote first)
    if (voteType === 'likes' && currentVote === 'disliked') return;
    if (voteType === 'dislikes' && currentVote === 'liked') return;

    // --- CALCULATE NEW VALUES ---
    if (voteType === 'likes') {
        if (currentVote === 'liked') {
            // UN-VOTE (Remove Like)
            item.likes = Math.max(0, item.likes - 1);
            local.removeItem(storageKey);
            setButtonState('reset');
        } else {
            // VOTE (Add Like)
            item.likes += 1;
            local.setItem(storageKey, 'liked');
            setButtonState('agree');
        }
    } 
    else if (voteType === 'dislikes') {
        if (currentVote === 'disliked') {
            // UN-VOTE (Remove Dislike)
            item.dislikes = Math.max(0, item.dislikes - 1);
            local.removeItem(storageKey);
            setButtonState('reset');
        } else {
            // VOTE (Add Dislike)
            item.dislikes += 1;
            local.setItem(storageKey, 'disliked');
            setButtonState('disagree');
        }
    }

    // --- INSTANT VISUAL UPDATE (The "Magic" Part) ---
    // We update the bar NOW, before the database finishes. 
    updateVoteBar(item.likes, item.dislikes);

    // --- SAVE TO DATABASE ---
    try {
        await wixData.update("CommentsCollection", item);
        await dataset.refresh(); // Syncs the dataset to match reality
        console.log("Vote saved successfully");
    } catch (err) {
        console.error("Vote failed:", err);
    }
}

/**
 * VISUAL: Updates the HTML Embed
 */
function updateVoteBar(likes, dislikes) {
    let total = likes + dislikes;

    // Calculate Percentages (Default to 50/50 if total is 0 to look balanced)
    let agreePercent = (total === 0) ? 50 : (likes / total) * 100;
    let disagreePercent = (total === 0) ? 50 : (dislikes / total) * 100;

    // Send to HTML Component
    $w("#htmlVoteBar").postMessage({
        "agreePercent": agreePercent,
        "disagreePercent": disagreePercent
    });
}

/**
 * VISUAL: Updates Button Colors & Disabled States
 */
function setButtonState(state) {
    const btnAgree = $w("#btnAgree");
    const btnDisagree = $w("#btnDisagree");

    if (state === 'agree') {
        // Highlight Agree
        btnAgree.style.backgroundColor = COLOR_ACTIVE;
        btnAgree.style.color = COLOR_TEXT_ACTIVE;
        
        // Disable Disagree
        btnDisagree.disable(); 
        btnDisagree.style.backgroundColor = COLOR_DEFAULT;
        btnDisagree.style.color = COLOR_TEXT_DEFAULT;
    } 
    else if (state === 'disagree') {
        // Highlight Disagree
        btnDisagree.style.backgroundColor = "#FF7F50"; // Specific Orange for Disagree
        btnDisagree.style.color = COLOR_TEXT_ACTIVE;

        // Disable Agree
        btnAgree.disable();
        btnAgree.style.backgroundColor = COLOR_DEFAULT;
        btnAgree.style.color = COLOR_TEXT_DEFAULT;
    } 
    else {
        // Reset Everything (Enable Both)
        btnAgree.enable();
        btnDisagree.enable();

        // Reset Colors
        btnAgree.style.backgroundColor = COLOR_DEFAULT;
        btnAgree.style.color = COLOR_TEXT_DEFAULT;
        btnDisagree.style.backgroundColor = COLOR_DEFAULT;
        btnDisagree.style.color = COLOR_TEXT_DEFAULT;
    }
}
