let jsonRequester = (()=> {

    function getSectionData(ctx, sections){
        return new Promise((resolve, reject) => {
            sections.unshift('nav');
            let data = {};
            let promises = [];
            sections.forEach(section => {
                promises.push(
                    $.getJSON(`content/${section}.json`))
            });
            console.log('Inside promise from getSelectionData');
            return Promise.all(promises);
        })
    }

    function getData(sections){

    }


    function logIn(email, pass){

    }
    

    return {
        getSectionData,
        logIn,
    }
})()
