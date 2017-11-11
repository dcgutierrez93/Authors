$(document).ready(function() {
    const nameInput = $("#author-name");
    const authorList = $("tbody");
    const authorContainer = $(".author-container");

    $(document).on("submit", "#author-form", handleAuthorFormSubmit);
    $(document).on("click", ".delete-author", handleDeleteButtonPress);

    getAuthors();

    // Handle form submit
    function handleAuthorFormSubmit(event) {
        event.preventDefault();

        if (!name.val().trim().trim()) {
            return;
        }

        upsertAuthor({name: nameInput.val().trim()});
    }

    // Create an author
    function upsertAuthor(authorData) {
        $.post("/api/authors", authorData).then(getAuthors);
    }

    // Createing new list of row for Authors
    function createAuthorRow(authorData) {
        var newTr = $("<tr>");
        newTr.data("author", authorData);
        newTr.append("<td>" + authorData.name + "</td>");
        newTr.append("<td> " + authorData.Posts.length + "</td>");
        newTr.append("<td><a href='/blog?author_id=" + authorData.id + "'>Go to Posts</a></td>");
        newTr.append("<td><a href='/cms?author_id=" + authorData.id + "'>Create a Post</a></td>");
        newTr.append("<td><a style='cursor:pointer;color:red' class='delete-author'>Delete Author</a></td>");
        return newTr;
    }

    // Function for retrieving authors and getting them ready to be rendered.
    function getAuthors() {
        $.get("/api/authors", function(data) {
            var rowsToAdd = [];
            for (var i = 0; i < data.length; i++) {
                rowsToAdd.push(createAuthorRow(data[i]));
            }
            renderAuthorList(rowsToAdd);
            nameInput.val("";)
        });
    }

    // Function for rendering list of authors to page
    function renderAuthorList(rows) {
        authorList.children().not(":last").remove();
        authorList.children().children(".alert").remove();
        if (rows.length) {
            console.log(rows);
            authorList.prepend(rows);
        } else {
            renderEmpty();
        }
    }

    // Funciton for handling what to render.
    function renderEmpty() {
        var alertDiv = $("<div>");
        alertDiv.addClass("alert alert-danger");
        alertDiv.html("You must create an Author before you can create a Post.");
        authorContainer.append(alertDiv);
    }

    // Function for handling delete button
    function handleDeleteButtonPress() {
        var listItemData = $(this).parent("td").parent("tr").data("author");
        var id = listItemData.id;
        $.ajax({
            method: "DELETE",
            url: "/api/authors/" + id
        }).done(getAuthors);
    }
});
