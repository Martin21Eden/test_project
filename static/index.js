let domain = 'http://localhost:8000/';

window.onload = function() {
    let list = document.getElementById('container');

    let id = document.getElementById('id');
    let title = document.getElementById( 'title');
    let content = document.getElementById('content');

    let username = document.getElementById('username');
    let password = document.getElementById('password');

    let loginBtn = document.getElementById('login-btn');
    let regBtn = document.getElementById('reg-btn');


    let reg_username = document.getElementById('reg-username');
    let reg_password = document.getElementById('reg-password');

    let firstname = document.getElementById('first-name');
    let lastname = document.getElementById('last-name');
    let email = document.getElementById('email');


    $(document).ready(function(){
        $("#login-btn").click(function(){
        $("#myModal").modal();
            });
        });

    $(document).ready(function(){
        $("#reg-btn").click(function(){
        $("#reg-modal").modal();
            });
        });
      $(document).ready(function(){
        $("#post-btn").click(function(){
        $("#post-modal").modal();
            });
        });


    let LogoutBtn = document.getElementById('logout-btn');
        LogoutBtn.addEventListener('click', function (evt) {
            evt.preventDefault();
            window.localStorage.clear();
            LogoutBtn.style.visibility = 'hidden';

            loginBtn.style.visibility = "visible";
            regBtn.style.visibility = "visible";
            postListLoad()
        });


        let regForm = document.getElementById('reg_form');
        regForm.addEventListener('submit', function (evt) {
        evt.preventDefault();
        let url = 'api/users/';
        let data = JSON.stringify({username: reg_username.value,
                                        password: reg_password.value,
                                        email: email.value,
                                        first_name: firstname.value,
                                        last_name: lastname.value
        });


        let request = new XMLHttpRequest();
        request.onreadystatechange = function () {
            if (request.readyState === 4) {

                if (request.status === 201) {
                    window.localStorage.setItem('user_data', request.responseText);
                    let url = 'api/token/';
                    let data = JSON.stringify({username: reg_username.value, password: reg_password.value});
                        loginer.open('POST', domain + url, true);
                        loginer.setRequestHeader( 'Content-Type',
                        'application/json');
                        loginer.send(data);
                        $("#reg-modal").modal('hide');
                        postListLoad()
                }
                else {
                    window.alert(request.responseText);
                }
            }
        };

        request.open('POST', domain + url, true);
        request.setRequestHeader( 'Content-Type',
        'application/json');
        request.send(data);
    });



    let loginer = new XMLHttpRequest();
        loginer.onreadystatechange = function () {
            if (loginer.readyState === 4) {

                if (loginer.status === 200) {
                    let data = JSON.parse(loginer.responseText);
                    window.localStorage.setItem('access_token', data.access);
                    window.localStorage.setItem('refresh_token', data.refresh);
                    postListLoad();
                    $("#myModal").modal('hide');
                    LogoutBtn.style.visibility = 'visible';
                    loginBtn.style.visibility = "hidden";
                    regBtn.style.visibility = "hidden";
                    SetUserData();
                }
                else {
                    window.alert(loginer.responseText);
                }
            }
        };


    let loginForm = document.getElementById('login_form');
    loginForm.addEventListener('submit', function (evt) {
        evt.preventDefault();
        let url = 'api/token/';
        let data = JSON.stringify({username: username.value, password: password.value});

        loginer.open('POST', domain + url, true);
        loginer.setRequestHeader( 'Content-Type',
        'application/json');
        loginer.send(data);
    });


    function refreshToken(){
    let request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (postListLoader.readyState === 4) {
            if (postListLoader.status === 200) {
                let data = JSON.parse(request.responseText);
                    window.localStorage.setItem('access_token', data.access);
            }
            else {
                window.alert(request.responseText);
            }
        }
    };


    let data = JSON.stringify({refresh: window.localStorage.getItem('refresh_token')});

    request.open ( 'POST', domain + 'api/token/refresh/', true);
    request.setRequestHeader( 'Content-Type',
        'application/json');
    request.setRequestHeader('Authorization','Bearer '+ window.localStorage.getItem('access_token'));
    request.send(data);
    }

    
    function postLoad(evt){
    evt.preventDefault();
    let url = evt.target.href;
    $("#post-modal").modal();
    let request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (postListLoader.readyState === 4) {
            if (postListLoader.status === 200) {
                let data = JSON.parse(request.responseText);
                id.value = data.id;
                title.value = data.title;
                content.value = data.content;
            }
            else {
                window.alert(request.responseText);
            }
        }
    };

    request.open ( 'GET', url, true);
    request.send();
    }
    

    let postForm = document.getElementById('rubric_form');
    postForm.addEventListener('submit', function (evt) {
        evt.preventDefault();
        let vid = id.value;
        let url = 'api/posts/';
        let method = 'POST';
        if (vid) {
            url = 'api/posts/' + vid + '/';
            method = 'PATCH';
        }
        let data = JSON.stringify({id: vid, title: title.value, content: content.value});

        let request = new XMLHttpRequest();
        request.onreadystatechange = function () {
            if (request.readyState === 4) {
                if (request.status === 201 || request.status === 200) {
                    postListLoad();
                    postForm.reset();
                    id.value = '';
                        $("#post-modal").modal('hide');
                } else if (request.status === 401 ) {
                    refreshToken()
                } else {
                window.alert(request.responseText);
                }
            }
        };


        request.open(method, domain + url, true);
        request.setRequestHeader( 'Content-Type',
        'application/json');
        request.setRequestHeader('Authorization','Bearer '+ window.localStorage.getItem('access_token'));
        request.send(data);
    });


    let postDeleter= new XMLHttpRequest();
    postDeleter.onreadystatechange = function () {
        if (postDeleter.readyState === 4) {
            if (postDeleter.status === 204) {
                console.log(postDeleter.responseText);
                postListLoad();
            } else if (postDeleter.status === 401 ) {
                    refreshToken()
            } else {
                window.alert(postDeleter.responseText);
            }
        }
    };


    function postDelete(evt) {
        evt.preventDefault();
        let url = evt.target.href;
        postDeleter.open('DELETE', url, true);
        postDeleter.setRequestHeader('Authorization','Bearer '+ window.localStorage.getItem('access_token'));
        postDeleter.send();
    }


    function SetUserData() {
        let UserGetter= new XMLHttpRequest();

        UserGetter.onreadystatechange = function () {
            if (UserGetter.readyState === 4) {
                if (UserGetter.status === 200) {
                    window.localStorage.setItem('user_data', UserGetter.responseText);
                }
                else {
                    window.alert(UserGetter.responseText);
                }
            }
        };
        UserGetter.open('GET', domain + 'api/user_data/', true);
        UserGetter.setRequestHeader('Authorization','Bearer '+ window.localStorage.getItem('access_token'));
        UserGetter.send();
    }


    let postListLoader = new XMLHttpRequest();
    postListLoader.onreadystatechange = function () {
        if (postListLoader.readyState === 4) {

            if (postListLoader.status === 200) {
                let data = JSON.parse(postListLoader.responseText);
                let s = '';

                for (i = 0; i < data.length; i++) {
                    d = data[i];
                    let style="hidden;"; //visible
                    let user_data = JSON.parse(window.localStorage.getItem('user_data'));
                    if (user_data !== null && d.author === user_data.id){
                        style = "visible;"
                    }
                    detail_url = '<a href="' + domain + 'api/posts/' + d.id + '/"  class="detail" style="visibility: '+style+'"> Edit </a>';
                    delete_url = '<a href="' + domain + 'api/posts/' + d.id + '/" class="delete" style="visibility:' +style+'"> Delete </a>';
                    like_url = '<a href="' + domain + 'api/posts/'  + d.id + '/like/" class="like" id="'+i+'"> Like: </a>';
                    unlike_url = '<a href="' + domain + 'api/posts/'  + d.id + '/unlike/" class="unlike" id="'+i+'"> Unlike: </a>';

                     s += '<article class="media content-section">'+
                          '<div class="media-body">'+
                            '<div class="article-metadata">'+
                              '<a class="mr-2" href=></a>'+
                              '<small class="text-muted">'+d.date_posted+' </small></div>'+
                            '<h2>'+d.title + '</h2> '+
                            '<p class="article-content" id="content">'+d.content+' <p>'+ like_url + '<a id="like_'+i+'">'+d.like+'</a>' + unlike_url  + '<a id="unlike_'+i+'">'+d.unlike+'</a>' +'</p> </p></div> '+
                             '<p>'+detail_url + delete_url+'</p>'+
                         '</article>';
                    }
                list.innerHTML = s;

                links = list.querySelectorAll('a.detail, a.delete, a.like, a.unlike');

                for (i = 0; i < data.length*4; i++) {
                    if (links[i].className === 'detail') {
                        links[i].addEventListener( 'click' , postLoad);
                    } else if (links[i].className === 'delete') {
                        links[i].addEventListener('click', postDelete);
                    } else if (links[i].className === 'like') {
                        links[i].addEventListener( 'click', putLike);
                    } else if (links[i].className === 'unlike') {
                        links[i].addEventListener( 'click', putUnlike);
                    }
                }
            }
        }
    };


    let makeLike = new XMLHttpRequest();
    makeLike.onreadystatechange = function() {
        if (makeLike.readyState === 4) {
            if (makeLike.status === 200) {
                let data = JSON.parse(makeLike.responseText);
                let like = document.getElementById('like_' + id_pop);
                let unlike = document.getElementById('unlike_' + id_pop);
                like.innerHTML = data.like;
                unlike.innerHTML = data.unlike;
            } else if (makeLike.status === 401 ) {
                    refreshToken()
            } else {
                window.alert(makeLike.responseText);
            }

        }
    };


    function putLike(evt) {
        evt.preventDefault();
        id_pop = evt.toElement.id;
        let url = evt.target.href;
        makeLike.open('GET', url, true);
        makeLike.setRequestHeader('Authorization', 'Bearer ' + window.localStorage.getItem('access_token'));
        makeLike.send();
    }

        function putUnlike(evt) {
        evt.preventDefault();
        id_pop = evt.toElement.id;
        let url = evt.target.href;
        makeLike.open('GET', url, true);
        makeLike.setRequestHeader('Authorization','Bearer '+ window.localStorage.getItem('access_token'));
        makeLike.send();
    }


    function postListLoad() {
        postListLoader.open('GET', domain + 'api/posts/', true);
        postListLoader.send();
    }


    function headerChange() {
        if ( window.localStorage.getItem('access_token') !== null){
            LogoutBtn.style.visibility = 'visible';
            loginBtn.style.visibility = "hidden";
            regBtn.style.visibility = "hidden";
        } else {
            LogoutBtn.style.visibility = 'hidden';
            loginBtn.style.visibility = "visible";
            regBtn.style.visibility = "visible";
        }
    }


headerChange();
postListLoad();
};
