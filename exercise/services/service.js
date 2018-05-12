var Service = function () {
    this.init();
}

Service.prototype = {
    init: function () {
        this.apiUrl = 'http://www.mocky.io/v2/5af11f8c3100004d0096c7ed' 
    },
    masterdata: function () {
        return $.ajax({
            type: "GET",
            url: this.apiUrl ,
            dataType: "json",
            headers: {
                "Content-Type": "application/json"
            },
            success: function (json) {
                console.log('Masterdata: Success')
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log('Masterdata: ' + xhr.status, thrownError);
            }
        });
    },
}