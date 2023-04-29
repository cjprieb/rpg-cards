
let ui_generate_modal_shown = false;

export function generatePage(page_options, card_options, card_data) {
    if (card_data.length === 0) {
        alert("Your deck is empty. Please define some cards first, or load the sample deck.");
        return;
    }

    // Generate output HTML
    var card_html = card_pages_generate_html(page_options, card_options, card_data);

    // Open a new window for the output
    // Use a separate window to avoid CSS conflicts
    var tab = window.open("output.html", 'rpg-cards-output');

    if (ui_generate_modal_shown === false) {
        $("#print-modal").modal('show');
        ui_generate_modal_shown = true;
    }

    // Send the generated HTML to the new window
    // Use a delay to give the new window time to set up a message listener
    setTimeout(function () { tab.postMessage(card_html, '*'); }, 500);
}

export function renderSelectedCard(card_options, card_data) {
    $('#preview-container').empty();
    if (card_data) {
        var front = card_generate_front(card_data, card_options);
        var back = card_generate_back(card_data, card_options);
        $('#preview-container').html(front + "\n" + back);
    }
}

export function card_default_data() {
    return {
        count: 1,
        title: "New card",
        contents: [],
        tags: [],
        font_size: "",
        title_size: "",
        include_text_on_back: false,
        single_sided: false,
        back_contents: [],
    };
}