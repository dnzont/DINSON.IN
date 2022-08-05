$(document).ready(function () {



    $(".sa_identity_ref").keyup(function () {

        var string = $(this).val();
        var string = string.replace(/[^a-zA-Z0-9]/g, '-');

        var string = string.replace(/\-+/g, '-');

        var string = string.toLowerCase();

        $(".sa_identity_val").val(string.trim());

    });
    $(".sa_identity_val").keyup(function () {

        var string = $(this).val();
        var string = string.replace(/[^a-zA-Z0-9]/g, '-');

        var string = string.replace(/\-+/g, '-');

        var string = string.toLowerCase();

        $(".sa_identity_val").val(string.trim());

    });



    $('body').on('change', '.sa_file_upload', function () {


        var form_attachment_count = $(this).attr("data-attachment_count");
        var maxSize = $(this).attr("data-upload_size");
        var base_url = $(".base_url").val();
        var mime_types = mime_types_array();
        var final_images = $('.sa_final_images_' + form_attachment_count).val();
        var input_name = $(this).attr('data-input_name');
        var upload_form_type = $(".sa_form_type_" + form_attachment_count).val();
        $('.sa_file_input_name_' + form_attachment_count).val(input_name);

        var upload_permission = 0;
        if (upload_form_type == "update_gallery" && final_images == '') {
            upload_permission = 1;
        } else if (upload_form_type == "update_gallery" && final_images != '') {
            upload_permission = 0;
        } else if (upload_form_type != "update_gallery" && final_images == '') {
            upload_permission = 1;
        } else if (upload_form_type != "update_gallery" && final_images != '') {
            upload_permission = 1;
        }

        if (upload_permission == 1) {
            var check1 = 0;
            var check2 = 0;
            var check3 = 0;
            var check4 = 0;

            if (window.File && window.FileReader && window.FileList && window.Blob) {

                if (!$('.sa_file_upload').val()) {
                    $(".sa_error_" + form_attachment_count).html("Please choose your Image !");
                    check2 = 1;
                } else {
                    check2 = 0;
                }


                var ftype = $('.sa_file_upload')[0].files[0].type;
                var result = $('.sa_file_upload')[0].files;

                for (var x = 0; x < result.length; x++) {
                    var fle = result[x];
                    var fsize = fle.size;
                    var ftype = fle.type;
                    var fileSize = maxSize * 1048576;
                    if (fsize > fileSize) {
                        $(".sa_error_" + form_attachment_count).html("<b>" + bytesToSizenotrounded(fsize) + "</b>" + fle.name + " is too big, it should be less than " + bytesToSizenotrounded(fileSize));
                        check4 = 1;
                        throw new Error("File Size Is Maximum!");
                    } else {

                        check4 = 0;

                    }



                    var element_key = mime_types.indexOf(ftype);
                    if (element_key === -1) {
                        $(".sa_error_" + form_attachment_count).html("<b>" + ftype + "</b> Unsupported file type!");
                        check3 = 1;
                    } else {
                        check3 = 0;
                    }




                }
            } else {
                $(".sa_error_" + form_attachment_count).html("Please upgrade your browser, because your current browser lacks some new features we need!");
                check1 = 1;
            }



            var checktotal = check1 + check2 + check3 + check4;
            if (checktotal == 0) {
                $(".sa_attach_submit").prop("disabled", true);
                $(".sa_progress_" + form_attachment_count).removeClass("hide");
                var formUrl = base_url + 'general_admin/upload_file';
                var files = new FormData($(".sa_multiple_upload_form")[0]);
                $.ajax({
                    url: formUrl,
                    type: 'POST',
                    data: files,
                    mimeType: "multipart/form-data",
                    contentType: false,
                    cache: false,
                    processData: false,
                    success: function (data) {
                        $(".sa_attach_submit").prop("disabled", false);
                        $(".sa_progress_" + form_attachment_count).addClass("hide");
                        if (data.indexOf('***') != -1) {
                        } else {
                            var exist_files = $(".sa_final_images_" + form_attachment_count).val();
                            var full_files = exist_files + data;
                            $(".sa_final_images_" + form_attachment_count).val(full_files);

                            var updated_files = $(".sa_final_images_" + form_attachment_count).val();
                            var file_array = updated_files.split(",");
                            file_array.pop();

                            var img_extension = $('.sa_img_extension_' + form_attachment_count).val();
                            var img_extension_array = JSON.parse(img_extension);

                            $(".sa_preview_" + form_attachment_count).html('');

                            if (file_array.length > 0) {
                                for (i = 0; i < file_array.length; i++) {

                                    var result_extension = file_array[i].split('.').pop();


                                    if (upload_form_type == "update_gallery") {
                                        if (img_extension_array.indexOf(result_extension) != -1) {
                                            $(".sa_preview_" + form_attachment_count).append('<div class="col-md-4 sa_preview_item sa_preview_item_' + i + '" data_item_count="' + i + '" data_item_name="' + file_array[i] + '"><img src="' + base_url + 'media_files/' + file_array[i] + '" width="150" height="150"><a class="btn btn-circle btn-icon-only btn-default sa_image_remove" data-filename="' + file_array[i] + '" data-file_count="' + i + '" data-form_count="' + form_attachment_count + '"  href="javascript:void(0)"><i class="icon-trash"></i></a></div>');
                                        } else {
                                            $(".sa_preview_" + form_attachment_count).append('<div class="col-md-4 sa_preview_item sa_preview_item_' + i + '" data_item_count="' + i + '" data_item_name="' + file_array[i] + '"><img src="' + base_url + 'assets/adminpanel/developer_files/images/document.png" width="150" height="150"><a class="btn btn-circle btn-icon-only btn-default sa_image_remove" data-filename="' + file_array[i] + '" data-file_count="' + i + '" data-form_count="' + form_attachment_count + '" href="javascript:void(0)"><i class="icon-trash"></i></a></div>');

                                        }
                                    } else {
                                        if (img_extension_array.indexOf(result_extension) != -1) {
                                            $(".sa_preview_" + form_attachment_count).append('<div class="col-md-4 sa_preview_item sa_preview_item_' + i + '" data_item_count="' + i + '" data_item_name="' + file_array[i] + '"><img src="' + base_url + 'media_files/' + file_array[i] + '" width="150" height="150"><br><input type="text"  placeholder="Title" class="sa_image_title_' + i + '"><a class="btn btn-circle btn-icon-only btn-default sa_image_remove" data-filename="' + file_array[i] + '" data-file_count="' + i + '" data-form_count="' + form_attachment_count + '"  href="javascript:void(0)"><i class="icon-trash"></i></a></div>');
                                        } else {
                                            $(".sa_preview_" + form_attachment_count).append('<div class="col-md-4 sa_preview_item sa_preview_item_' + i + '" data_item_count="' + i + '" data_item_name="' + file_array[i] + '"><img src="' + base_url + 'assets/adminpanel/developer_files/images/document.png" width="150" height="150"><br><input type="text" placeholder="Title" class="sa_image_title_' + i + '"><a class="btn btn-circle btn-icon-only btn-default sa_image_remove" data-filename="' + file_array[i] + '" data-file_count="' + i + '" data-form_count="' + form_attachment_count + '" href="javascript:void(0)"><i class="icon-trash"></i></a></div>');

                                        }
                                    }


                                }
                            }

                        }

                    }
                });
            }

        }

    });




});



function bytesToSizenotrounded(bytes) {

    if (bytes == 0)
        return '0 Bytes';
    var floatmb = (bytes / 1048576).toFixed(2) + "MB";
    return floatmb;
}




function mime_types_array() {
    var mime_types = [
        'text/x-comma-separated-values', 'text/comma-separated-values', 'application/octet-stream', 'application/vnd.ms-excel', 'text/x-csv', 'text/csv', 'application/csv', 'application/excel', 'application/vnd.msexcel', //csv
        'application/pdf', 'application/x-download', //pdf
        'application/excel', 'application/vnd.ms-excel', 'application/msexcel', //xls
        'application/powerpoint', 'application/vnd.ms-powerpoint', //ppt
        'audio/mpeg', //mpga
        'text/plain', //txt
        'audio/mpeg', //mp2
        'audio/mpeg', 'audio/mpg', 'audio/mpeg3', 'audio/mp3', //mp3
        'image/bmp', //bmp
        'image/gif', //gif
        'image/jpeg', 'image/pjpeg', //jpeg
        'image/jpeg', 'image/pjpeg', //jpg
        'image/jpeg', 'image/pjpeg', //jpe
        'image/png', 'image/x-png', //png
        'video/mpeg', //mpeg
        'video/mpeg', //mpg
        'video/mpeg', //mpe
        'video/quicktime', //qt
        'video/quicktime', //mov
        'video/x-msvideo', //avi
        'video/x-sgi-movie', //movie
        'application/msword', //doc
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', //docx
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', //xlsx
        'application/msword', 'application/octet-stream', //word
        'application/excel', //xl
        'image/svg+xml', //svg
        'video/mp4', //mp4
        'application/mp4' //mp4
    ];

    return mime_types;

}



$("body").on("click", ".sa_image_remove", function () {
    var filename = $(this).attr("data-filename");
    var file_count = $(this).attr("data-file_count");
    var form_attachment_count = $(this).attr("data-form_count");
    var files = $(".sa_final_images_" + form_attachment_count).val();

    var base_url = $(".base_url").val();
    $.ajax({
        type: "POST",
        url: base_url + "general_admin/remove_upload_file/",
        data: {filename: filename, files: files},
        cache: false,
        success: function (response) {
            $(".sa_preview_item_" + file_count).remove();
            $(".sa_final_images_" + form_attachment_count).val(response);
        }
    });

});



$("body").on("click", ".sa_attach_submit", function () {
    var i = 0;
    var attach_identity_length = $(".sa_attach_identity").length;
    $(".sa_attach_identity").each(function () {
        var final_image_post_array = [];
        var attach_identity = $(this).attr("data-attach_identity");
        var upload_form_type = $(".sa_form_type_" + attach_identity).val();

        $(".sa_preview_" + attach_identity + " .sa_preview_item").each(function () {

            var count = $(this).attr("data_item_count");
            var filename = $(this).attr("data_item_name");

            if (upload_form_type == "update_gallery") {
                final_image_post_array.push({filename: filename});
            } else {
                var title = $(this).find(".sa_image_title_" + count).val();
                final_image_post_array.push({filename: filename,
                    title: title});
            }

        });

        document.getElementById('final_image_post_' + attach_identity).value = JSON.stringify(final_image_post_array);
        final_image_post_array.length = 0;
        if (i == attach_identity_length - 1) {
            document.getElementById("sa_multiple_upload_form").submit();
        }
        i++;


    });

});


function removeitem(url) {
    var linkref = url;
    if (confirm("Do you really want to Delete ?")) {
        window.location.href = linkref;
    }
}


$(function () {
    if ($(".sa_sortable").length > 0) {
        $(".sa_sortable").sortable();
        $(".sa_sortable").disableSelection();
    }

});




$('.sa_search_sorting_form').submit(function (e) {

    var form_action = $(this).attr('action');
    e.preventDefault();

    var sa_search_sorting_form_object = $(".sa_search_sorting_form").serializeArray();
    var sa_url = "";
    $.each(sa_search_sorting_form_object, function (i, field) {

        var field_value = field.value;
        field_value = field_value.trim();
        field_value = field_value.replace("'", "");
        field_value = field_value.replace('"', '');
        field_value = field_value.replace('/', '');
        field_value = field_value.replace('&', '');
        field_value = field_value.replace(' ', '-');

        if (field_value !== "") {
            sa_url = sa_url + field.name + "=" + field_value + "&";
        }

    });
    var str_check = form_action.indexOf('?');
    str_con = '&';
    if (str_check < 0) {
        str_con = '?';
    }
    var sort_status = custom_validate();
    if (sort_status == true) {
        window.location = form_action + str_con + sa_url;
    }

});


$(".sa_enter_submit").keypress(function (event) {
    var sort_status = custom_validate();
    if (sort_status == true) {
        if (event.which == 13) {
            event.preventDefault();
            $("form").submit();
        }
    }
});

function custom_validate()
{
    var sort = $('.sa_sort').val();
    var custom_sort = $('.sa_custom_sort').val();

    if (sort !== '' && custom_sort === '')
    {
        $('.sa_custom_sort_error').html('field should not be empty');
        $('.sa_sort_error').html('');
        return false;
    } else if (sort === '' && custom_sort !== '')
    {
        $('.sa_custom_sort_error').html('');
        $('.sa_sort_error').html('field should not be empty');
        return false;
    } else
    {
        return true;
    }

}


function flash_message(msg) {

    //To Stop the previous animations
    $(".flash_message").stop();

    //To show message in specified style
    $(".flash_message").html(msg);
    $(".flash_message").fadeIn(400).delay(3000).fadeOut(400);
}
