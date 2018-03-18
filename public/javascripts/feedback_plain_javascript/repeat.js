$(document).ready(() => {
    $('#input').on("change", (evt) => {
        let text = $('#input').val();
        $.get('/feedback/text', {text: text})
            .done((data) => {
                console.log(data);
                $('#results').prepend('<li>' + data['result'] + '</li>');
                $('#input').val('');
            })
            .fail((xhr) => {
                alert('Oops! Somethint went wrong!');
                console.log(xhr);
            });
    });
});