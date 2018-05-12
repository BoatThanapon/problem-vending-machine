var vendingMachine = function (service) {
    this._service = service
    this.init()
    this._masterData = []
    this._coinReturn = []
    this._boxProduct = []
}

vendingMachine.prototype = {
    //this global
    init: function () {
        this.createChildren()
            .enable()
        this.setSelect()
    },
    /**
     * Define the variable of the elements.
     * @return {this}
     */
    createChildren: function () {
        //Product Menu
        this.$productMenu = $("#product-menu")

        //Input Coin
        this.$inpCoin = $("#inp-coin")
        this.$inpReturnCoin = $("#inp-return-coin")

        //Button Coin
        this.$oneCoin = $("#one-coin")
        this.$twoCoin = $("#two-coin")
        this.$fiveCoin = $("#five-coin")
        this.$tenCoin = $("#ten-coin")
        this.$btnRecieveCoin = $('#btn-recieve-coin')
        this.$btnRecieveProduct = $('#btn-recieve-product')
        this.$btnCancel =  $('#btn-cancel')

        return this
    },
    /**
     * Define the events.
     * @return {this}
     */
    enable: function () {
        const self = this

        this.$oneCoin.on('click', function () {
            self.addCoin(1, self);
        })
        this.$twoCoin.on('click', function () {
            self.addCoin(2, self);
        })
        this.$fiveCoin.on('click', function () {
            self.addCoin(5, self);
        })
        this.$tenCoin.on('click', function () {
            self.addCoin(10, self);
        })

        this.$inpCoin.on('change', function () {
            self.productEvent(self);
        })

        this.$btnRecieveCoin.on('click', function () {
            self.clearReturnCoin(self)
        })

        this.$btnRecieveProduct.on('click', function () {
            self.clearRecieveProduct(self)
        })

        this.$btnCancel.on('click', function () {
            self.cancelProduct(self)
        })

        // this.$inpCoin.on('change', this.productEvent.bind(this))

        return this
    },
    /**
     * Define the select element.
     * @return {} none
     */
    setSelect: function () {
        this._service.masterdata().done((json) => {
            const results = json
            this._masterData = results.data
            console.log('this._masterData:', this._masterData)

            this.$inpCoin.val(0)

            this.$inpReturnCoin.val(0)

            $.map(this._masterData, (value) => {
                (value.in_stock == true) ?
                this.$productMenu.prepend('<div class="col-md-6 card border-secondary">' +
                    '<img src="' + value.image + '" />' +
                    '<button type="button" class="btn btn-danger btn-lg btn-block" id="product-' + value.id + '">' + value.name + ' ' + value.price + ' Coins</button><br>' +
                    '</div>'
                ): this.$productMenu.prepend('<div class="col-md-6 card border-secondary">' +
                    '<img src="' + value.image + '" />' +
                    '<button type="button" class="btn btn-secondary btn-lg btn-block" id="product-' + value.id + '" disabled>' + value.name + ' ' + value.price + ' Coins</button><br>' +
                    '</div>'
                )

                const self = this
                $('#product-' + value.id).on('click', function () {
                    self.checkProduct(value.id, self)
                })
            })

            return this
        })

    },
    helperProduct: function (id) {
        const result = $.grep(this._masterData, function (e) { return e.id == id; });
        return result
    },
    helperReturn: function(result, product){
        if(result > 0){
            while(result > 0){
                if( result >= 10){
                    result = result - 10
                    this._coinReturn.push({coin:10})
                }
                else if(result >= 5){
                    result = result - 5
                    this._coinReturn.push({coin:5})
                }
                else if(result >= 2){
                    result = result - 2
                    this._coinReturn.push({coin:2}) 
                }
                else if(result >= 1){
                    result = result - 1
                    this._coinReturn.push({coin:1}) 
                }
            }
            this.$inpCoin.val(0)

            if(product != null){
                this._boxProduct.push(product)        
            }


            this.$inpCoin.trigger('change')        
        }
        else if( result == 0){
            this.$inpCoin.val(0)
            this.$inpCoin.trigger('change')
            
            if(product != null){
                this._boxProduct.push(product)        
            }      
        }
        else{
            alert('You can not buy '+ product.name)
        }

        $('#recieve-product').find('li').remove()
        $.map(this._boxProduct, (value) => {
            $('#recieve-product').append("<li class='list-group-item'>" + value.name + "</li>");
        });

        $('#return-coin').find('li').remove()
        $.map(this._coinReturn, (value) => {
            $('#return-coin').append("<li class='list-group-item'>" + value.coin + "</li>");
        });
    },
    productEvent: function (self) {
        const coin = self.$inpCoin.val()
        const data = self._masterData

        $.map(data, (value) => {
            var price = parseInt(value.price)
            if (value.in_stock == true) {
                if (price <= coin) {
                    $('#product-' + value.id).removeClass().addClass("btn btn-success btn-lg btn-block");
                } else {
                    $('#product-' + value.id).removeClass().addClass("btn btn-danger btn-lg btn-block");
                }
            }
        })
    },
    cancelProduct: function(self){
        var currentCoin = parseInt(self.$inpCoin.val()) 
        self.helperReturn(currentCoin, null)     
    },
    checkProduct: function(id,self){
        const findProduct = self.helperProduct(id)
        var productPrice = parseInt(findProduct[0].price)
        var currentCoin = parseInt(self.$inpCoin.val()) 

        var result = currentCoin - productPrice
        self.helperReturn(result,findProduct[0])     
    },
    addCoin: function (coin, self) {
        var currentCoin = parseInt(self.$inpCoin.val())
        var results = currentCoin + coin

        self.$inpCoin.val(parseInt(results))
        self.$inpCoin.trigger('change')
    },
    clearReturnCoin: function(self){
        self._coinReturn = []
        $('#return-coin').find('li').remove()
    },
    clearRecieveProduct: function(self){
        self._boxProduct = []
        $('#recieve-product').find('li').remove()
    },

    
}