$(() => {

    const app = Sammy('#layout', function () {

        let appCtx = this;

        this.use('Handlebars', 'hbs');

        this.helpers({
            switchLanguage(lang) {},
            getColor: function (level) {
                let l = Number(level);
                let bgColor;
                if (l < 25) {
                    bgColor = 'danger';
                } else if (l < 50) {
                    bgColor = 'warning';
                } else if (l < 75) {
                    bgColor = 'info';
                } else {
                    bgColor = 'success';
                }
                return bgColor;
            }
        });

        this.before(/\#\/bg|en$/g, function () {
            this.params.pageToTranslate = this.app.last_route.path.toString().slice(4, -2);
            console.log(this.params.pageToTranslate);
        });

        this.helpers({
            loadCommon: function (section, addPartials) {
                let ctx = this;
                let partials = {
                    nav
                };
                if (addPartials) {
                    for (let key of Object.keys(addPartials)) {
                        partials[key] = addPartials[key];
                    }
                }
                //let pArr = jsonRequester.getSectionData(ctx, [section]);
                //pArr.then(function() {console.log(r);console.log('pArr finished');})
                return $.getJSON(getLang(),
                        function (r) {
                            ctx.params.currentLanguage = r.currentLanguage;
                            ctx.params.nav = r.nav;
                            ctx.params.userEmail = sessionStorage.getItem('userEmail');
                            ctx.params[section] = r[section] ? r[section] : /contact|login|register/.test(section);
                        })
                    .then(function () {
                        // console.log('inside then after getJSON in loadCommon')
                        return ctx.loadPartials(partials);
                    }).fail(function () {
                        // console.log('There is problem with loading data.')
                        return false;
                    });
            }
        });

        this.get(ROUTES.index, function () {
            this.redirect(ROUTES.about);
        });

        this.get(ROUTES.about, function () {
            let ctx = this;
            this.loadCommon('about')
                .then(function () {
                    // console.log("Inside about in then clause on returned from LoadCommon ");
                    this.partial(layout, ctx.params, {
                        content: about
                    });
                });
        });

        this.get(ROUTES.experience, function () {
            let ctx = this;
            this.loadCommon('experience', {
                    experienceRecord
                })
                .then(function () {
                    // console.log(ctx);
                    this.partial(layout, ctx.params, {
                        content: experience
                    });
                });
        });

        this.get(ROUTES.skills, function () {
            let ctx = this;
            this.loadCommon('skills', {
                    skill
                })
                .then(function () {
                    // console.log(ctx);
                    ctx.params.skills.map(s => s["bootstrap-color"] = ctx.getColor(s.level));
                    this.partial(layout, ctx.params, {
                        content: skills
                    });
                });
        });

        this.get(ROUTES.education, function () {
            let ctx = this;
            this.loadCommon('education', {
                    edu,
                    eduTab
                })
                .then(function () {
                    // console.log(ctx);
                    this.partial(layout, ctx.params, {
                        content: education
                    });
                });
        });

        this.get(ROUTES.contact, function () {
            let ctx = this;
            this.loadCommon('contact', {})
                .then(function () {
                    // console.log(ctx);
                    this.partial(layout, ctx.params, {
                        content: contact
                    });
                });
        });

        this.get(ROUTES.projects, function () {
            let data = this.params;
            this.loadCommon('projects', {})
                .then(function () {
                    // console.log(ctx);
                    this.partial(layout, data, {
                        content: projects
                    });
                });
        });

        this.get(ROUTES.login, function () {
            let data = this.params;
            this.loadCommon('login', {})
                .then(function () {
                    this.partial(layout, data, {
                        content: login
                    });
                });
        });

        this.post(ROUTES.login, function () {
            let ctx = this;
            
            firebase.auth().signInWithEmailAndPassword(this.params.email, this.params.password)
                .then(function () {
                    console.log('posting login');
                    let user = firebase.auth().currentUser;
                    if (user) {
                        console.log('user is loggedin');
                        ctx.redirect(ROUTES.profile);
                    } else {
                        console.log('no loggedin user');
                        ctx.redirect(ROUTES.login);
                    }
                });
        });

        this.get(ROUTES.profile, function () {
            let data = this.params;
            let user = firebase.auth().currentUser;
            console.log('enter in profile');
            if (!user) {
                this.redirect(ROUTES.index);
            } else {
                console.log(data);
                this.loadCommon('profile', {})
                    .then(function () {
                        this.partial(layout, data, {
                            content: profile
                        });
                    });
            }

        });

        this.get(ROUTES.register, function () {
            let data = this.params;
            console.log(data)
            this.loadCommon('register', {})
                .then(function () {
                    this.partial(layout, data, {
                        content: register
                    });
                });
        });

        this.get(ROUTES.logout, function () {
            toggleSignIn();
            this.redirect(ROUTES.index);

        });

        this.post(ROUTES.register, function () {
            let data = {
                email: this.params.email,
                password: this.params.password
            };
            handleSignUp(data);
        });



        this.get("#/:lang", function () {
            if (this.params.lang !== sessionStorage.getItem('currentLanguage')) {
                sessionStorage.setItem('currentLanguage', this.params.lang);
            } else {
                console.log('The language is the same');
            }
            this.redirect(ROUTES[this.params.pageToTranslate]);
        });


    });

    app.run('index.html');
});