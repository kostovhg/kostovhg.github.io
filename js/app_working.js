$(() => {
    
    const app = Sammy('#layout', function () {

        let appCtx = this;

        this.use('Handlebars', 'hbs');

        this.helpers({
            switchLanguage(lang) {
            },
            getColor: function(level){
                let l = Number(level);
                let bgColor;
                if(l < 25){
                    bgColor = 'danger';
                } else if(l < 50){
                    bgColor = 'warning';
                } else if (l < 75){
                    bgColor = 'info';
                } else {
                    bgColor = 'success';
                }
                return bgColor;
            }
        })

        this.before( /\#\/bg|en$/g, function () {
            this.params.pageToTranslate = this.app.last_route.path.toString().slice(4, -2);
            console.log(this.params.pageToTranslate);
        });

        this.helpers({
            loadCommon: function (section, addPartials) {
                let ctx = this;
                let partials = {nav};
                if(addPartials) {
                    for (let key of Object.keys(addPartials)) {
                        partials[key] = addPartials[key];    
                    }
                }
                return $.getJSON(getLang(),
                        function (r) {
                            ctx.params.currentLanguage = r.currentLanguage;
                            ctx.params.nav = r.nav;
                            ctx.params[section] = r[section] ? r[section] : (section === "contact" ? true : false);
                        })
                    .then(function () {
                        return ctx.loadPartials(partials);
                    }).fail(function () {
                        // console.log('There is problem with loading data.')
                        return false;
                    })
            }
        })

        this.get(ROUTES.index, function () {
            this.redirect(ROUTES.about)
        })

        this.get(ROUTES.about, function () {
            let ctx = this;
            this.loadCommon('about')
                .then(function () {
                    this.partial(layout, ctx.params, {
                        content: about
                    });
                });
        });

        this.get(ROUTES.experience, function () {
            let ctx = this;
            this.loadCommon('experience', {experienceRecord})
            .then(function(){
                // console.log(ctx);
                this.partial(layout, ctx.params, {
                    content: experience
                })
            })
        });

        this.get(ROUTES.skills, function () {
            let ctx = this;
            this.loadCommon('skills', {skill})
            .then(function(){
                // console.log(ctx);
                ctx.params.skills.map(s => s["bootstrap-color"] = ctx.getColor(s.level));
                this.partial(layout, ctx.params, {
                    content: skills
                })
            })
        });

        this.get(ROUTES.education, function () {
            let ctx = this;
            this.loadCommon('education', {edu, eduTab})
            .then(function(){
                // console.log(ctx);
                this.partial(layout, ctx.params, {
                    content: education
                })
            })
        });

        this.get(ROUTES.contact, function () {
            let ctx = this;
            this.loadCommon('contact', {})
            .then(function(){
                // console.log(ctx);
                this.partial(layout, ctx.params, {
                    content: contact
                })
            })
        });

        this.get(ROUTES.projects, function () {
            let data = this.params;
            this.loadCommon('projects', {})
            .then(function(){
                // console.log(ctx);
                this.partial(layout, data, {
                    content: projects
                })
            })
        });


        this.get("#/:lang", function () {
            if (this.params.lang !== sessionStorage.getItem('currentLanguage')) {
                sessionStorage.setItem('currentLanguage', this.params.lang);
            } else {
                console.log('The language is the same');
                // redirection is poitless
            }
            this.redirect(ROUTES[this.params.pageToTranslate]);
        })

    
    });

    app.run('index.html');
});