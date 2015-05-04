var files = 1;
$("#add-file").on("click", function(event) {
    files++;
    var html = '<br><label>File ' + files.toString() + ':</label><br>' + '<input type="file" class="file-upload" name="file' + files.toString() + '">';
    $(".file-upload").last().after(html);
    $(".number-of-files").val(files.toString());
});