// Import the necessary Wix APIs
import wixData from 'wix-data';
import wixLocation from 'wix-location';

$w.onReady(function () {
    // --- REPEATER ITEM LOGIC ---
    // Make the function ASYNC to allow database queries with 'await'
    $w('#repeater1').onItemReady(async ($item, itemData, index) => {
        

        const category = itemData.category;
        const textElement = $item("#categoryTxt");

        switch (category) {

            case "Transportation & Mobility":
                textElement.style.color = "#5D4037"; // Dark Brown
                break;

            case "Land Use & Development":
                textElement.style.color = "#0D47A1"; // Strong Blue
                break;

            case "Economy & Local Business":
                // Pure yellow is hard to read on white. We use "Dark Goldenrod" or "Ochre".
                textElement.style.color = "#B8860B"; // Dark Gold / Dark Yellow
                break;
            
             case "Community Services & Well-Being":
                // Pure yellow is hard to read on white. We use "Dark Goldenrod" or "Ochre".
                textElement.style.color = "#CB5906"; // Dark Gold / Dark Yellow
                break;

            case "Environment & Public Spaces":
                textElement.style.color = "#2E7D32"; // Forest Green
                break;

            default:
                // Fallback color (e.g., Dark Gray or Black) if no match found
                textElement.style.color = "#333333"; 
                break;
        }





        // --- Logic for Text Truncation ---
        const characterLimit = 180; 
        if (itemData.content) {
            const fullText = itemData.content.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
            if (fullText.length > characterLimit) {
                const truncatedText = fullText.substring(0, characterLimit) + "...";
                $item('#contentPreviewText').text = truncatedText;
            } else {
                $item('#contentPreviewText').text = fullText;
            }
        }
        
        // --- NEW: LOGIC FOR COMMENT COUNT ---
        
        // --- Link repeater card to its dynamic page ---
        const dynamicPageLink = itemData['link-commentscollection-title'];
        $item('#clickBox').onClick(() => {
            wixLocation.to(dynamicPageLink);
        });
    });

    // --- SEARCH FUNCTIONALITY ---
    // (Your existing search and sorting code remains the same)
    $w('#btnClearSearch').hide();

    $w('#inputSearch').onInput(() => {
        const searchValue = $w('#inputSearch').value;
        if (searchValue.length > 0) {
            filterCollection(searchValue);
            $w('#btnClearSearch').show('fade');
        } else {
            $w('#dataset1').setFilter(wixData.filter());
            $w('#btnClearSearch').hide('fade');
        }
    });

    $w('#btnClearSearch').onClick(() => {
        $w('#inputSearch').value = null;
        $w('#dataset1').setFilter(wixData.filter());
        $w('#btnClearSearch').hide('fade');
    });

    // --- SORTING FUNCTIONALITY ---
    $w('#dropdownSortBy').onChange((event) => {
        let selectedValue = event.target.value;
        let sort = wixData.sort();
        switch (selectedValue) {
            case 'new':
                sort = sort.descending('_createdDate');
                break;
            case 'old':
                sort = sort.ascending('_createdDate');
                break;
            case 'most_popular':
                sort = sort.descending('likes');
                break;
            case 'least_popular':
                sort = sort.descending('dislikes');
                break;
        }
        $w('#dataset1').setSort(sort);
    });
});

// -------------------------------------------------------------------
// --- HELPER FUNCTIONS (MUST BE OUTSIDE AND AFTER onReady) ---
// -------------------------------------------------------------------



// This separate function builds and applies the filter
function filterCollection(searchValue) {
        // Build a filter that searches for the value in all your specified text fields.
        const filter = wixData.filter()
        .contains('title', searchValue)
        .or(wixData.filter().contains('content', searchValue))
        .or(wixData.filter().contains('tags', searchValue))
        .or(wixData.filter().contains('staffComment', searchValue))
        .or(wixData.filter().contains('timeline', searchValue));

    // Apply the filter to your dataset
    // Make sure your dataset ID is #dataset1
    $w('#dataset1').setFilter(filter);
}
