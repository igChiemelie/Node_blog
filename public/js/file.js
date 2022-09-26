M.AutoInit();//Initiliazie all materialize behaviours

// $('.navbar-fixed').hide();
// $(window).scroll(function (event) {
//     var scrollpos = $(window).scrollTop();
//     if (scrollpos <= 100) {
//         $('.navbar-fixed').hide('slow');
//     } else if (scrollpos > 160) {
//         $('.navbar-fixed').show('slow');
//     }
// });

$('.dropdown-trigger').dropdown({
    coverTrigger: false
});



let picka = $(".datepicker").datepicker({
    selectMonths: true,
    selectYears: 1,
    format: 'yyyy-mm-d',
    setDefaultDate: true,
});

$('#toRegister').on('click', (e)=> {
    e.preventDefault();
    $('.reg-div').removeClass('hide');
    $('.login-div').addClass('hide');
});

$('#toLogin').on('click', (e)=> {
    e.preventDefault();

    $('.reg-div').addClass('hide');
    $('.login-div').removeClass('hide');
});

$("#forgotPas").on('click',(e)=>{
    e.preventDefault();
    $('.reg-div').addClass('hide');
    $('.login-div').addClass('hide');
    $('.forgot-div').removeClass('hide');
});
$("#textarea1").characterCounter();

// Edit Category Modal
$('.editCat').on('click', function (e) {
    e.preventDefault();
    let catId = $(this).attr('data-id');
    let cat = $(this).attr('data-cat');
    console.log(catId);
    console.log(cat);

    $('#editCatInput').val(cat);
    $('#editCatInputId').val(catId);

    $('#editModal').modal('open');
});

// Delete Category Modal
$('.delCat').on('click', function (e) {
    e.preventDefault();
    let delCat = $(this).attr('data-cat');
    let delCatId = $(this).attr('data-id');

    $('#deleteCatInput').val(delCat);
    $('#deleteCatInputId').val(delCatId);

    $('#delModal').modal('open');
});

$('#doDeleteCat').on('click', (e) => {
    e.preventDefault();
    let delCatId = $('#deleteCatInputId').val();
    $.ajax({
        type: 'POST',
        url: '/deleteCategory',
        cache: false,
        data: { delCatId: delCatId },
        success: (data) => {
            // console.log(data);
            location.reload();
        }
    });
});


// // Create Article Keyup
// $('#textarea1').on('keyup', function () {
//     let artTitle = $('#artTitle').val();
//     let textarea1 = $('#textarea1').val();

//     if (artTitle != "" && textarea1 != "") {
//         $('#artBtn').prop('disabled', false);
//     } else {
//         $('#artBtn').prop('disabled', true);
//     }
// });

//Post article
$('#submitPost').on('submit', function () {
    console.log('submitted');
    let artTitle = $('#artTitle').val();
    let artCat = $('#artCat').val();
    let textarea1 = $('#textarea1').val();
    let articleImg = $('input[name="articleImg"]')[0].files[0];
    let imgName = articleImg.name;

    console.log(artTitle);
    console.log(artCat);
    console.log(textarea1);
    console.log(articleImg);
    console.log(imgName);

    $.ajax({
        type: 'POST',
        url: '/article',
        cache: false,
        data: { artTitle: artTitle, artCat: artCat, textarea1: textarea1, imgName: imgName },
        success: (data) => {
            console.log(data);
            console.log('entered');
            // window.location.href = "/singleArticleRead";
        },
        error: (err) => {
            console.log(err +'error here!');
        }
    });


});

// Edit Article Keyup
$('#editArtText').on('keyup', function () {
    let editArtTitle = $('#editArtTitle').val();
    let editArtText = $('#editArtText').val();

    if (editArtTitle != "" && editArtText != "") {
        $('#editArtBtn').prop('disabled', false);
    } else {
        $('#editArtBtn').prop('disabled', true);
    }
});
// Edit Article Data-Value / Modal Open
$('.editArtModal').on('click', function (e) {
    e.preventDefault();

    let editArtTitle = $(this).attr('data-title');
    let editArtText = $(this).attr('data-post');
    let editArtCat = $(this).attr('data-cat');
    let artCatId = $(this).attr('data-id');

    $('#editArtTitle').val(editArtTitle);
    $('#editArtText').val(editArtText);
    $('#editArtCat').val(editArtCat);
    $('#artCatId').val(artCatId);

    $('#editArtOpenModal').modal('open');
});

// Delete Article Section
$('.delOpenArtModal').on('click', function (e) {
    e.preventDefault();
    let delArtId = $(this).attr('data-artId');

    $('#deleteArtInputId').val(delArtId);
    $('#delArtModal').modal('open');
});

$('#doDeleteArt').on('click', (e) => {
    e.preventDefault();
    let delArtId = $('#deleteArtInputId').val();
    $.ajax({
        type: 'POST',
        url: '/deleteArticle',
        cache: false,
        data: { delArtId: delArtId },
        success: (data) => {
            location.reload();
        }
    });
});


// Edit User's Section
$('.editUser').on('click', function (e) {
    e.preventDefault();

    let editUserId = $(this).attr('data-id');
    let editUserFname = $(this).attr('data-fName');
    let editUserLname = $(this).attr('data-lName');
    let editUserUname = $(this).attr('data-uName');
    let editUseremail = $(this).attr('data-email');
    let editUserDob = $(this).attr('data-dob');

    $('#editUserId').val(editUserId);
    $('#editUserfname').val(editUserFname);
    $('#editUserlname').val(editUserLname);
    $('#editUserUname').val(editUserUname);
    $('#email').val(editUseremail);
    $('#dob').val(editUserDob);

    $('#editUserModal').modal('open');
});


// // Edit User's keyup 
// $('#editUserUname').on('keyup', function () {
//     let editUserFname = $('#editUserFname').val();
//     let editUserLname = $('#editUserLname').val();
//     let editUserUname = $('#editUserUname').val();

//     if (editUserFname != "" && editUserLname != "" && editUserUname != "") {
//         $('#editUserBtn').prop('disabled', false);
//     } else {
//         $('#editUserBtn').prop('disabled', true);
//     }
// });

$('.dataTitle').on('click', function () {
    // e.preventDefault();

    let sigArtId = $(this).attr('data-sigArtId');
    // console.log(sigArtId);
    $('#sigArtId').val(sigArtId);
    let artId = $('#sigArtId').val();
    // console.log(artId);
    $.ajax({
        type: 'POST',
        url: '/singleArticlePost',
        cache: false,
        data: { artId: artId },
        success: (data) => {
            console.log('entered');
            window.location.href = "/singleArticleRead";
        },
        error: () => {
            console.log('error here!');
        }
    });
});