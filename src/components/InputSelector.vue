<template>
    <div class="input-selector">

        <div class="ui-selector form-group">
            <label :for="id + '_input'">{{title}}</label>
            <div class="input-group">
                <input :id="id + '_input'" type="text" class="form-control" :placeholder="'Choose ' + title + '...' "  v-model="name" :class="{ 'is-invalid' : inputError}" readonly>
                <div class="input-group-append">
                    <button class="btn btn-outline-primary" type="button" @click="openDialog">Select</button>
                </div>
                <div class="invalid-feedback">
                    {{errorMessage}}
                </div>
                <div class="spinner" v-show="busy">
                    <div class="dot1"></div>
                    <div class="dot2"></div>
                </div>
            </div>
            
        </div>
        <div class="modal" tabindex="-1" role="dialog" :id="id + '_dialog'">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title text-center">Choose {{title}}</h4>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    </div>
                    <div class="modal-body">
                        <div class="ui-search">
                            <div class="form-group label-floating">
                                <label :for="id">Search</label>
                                <input :id="id + '_input-dialog'" type="text" placeholder="Cari..." v-model="keyword" class="form-control input-text" autocomplete="off"
                                       @keydown.up="moveUp"
                                       @keydown.down="moveDown"
                                       @keydown.home="moveHome"
                                       @keydown.end="moveEnd"
                                       @keydown.enter="select"
                                       @keydown.pageUp="movePageUp"
                                       @keydown.pageDown="movePageDown"
                                        >
                            </div>
                            <ul class="dialog-selector">
                                <li class='list-item'
                                    v-for="(option,index) in fItems"
                                    @click="select"
                                    @mouseenter="highlightedPosition=index"
                                    :class="{'highlighted' : highlightedPosition === index}"
                                ><p>{{option.name}}</p></li>
                            </ul>
                            <div v-if="fItems.length===0" class="text-center"><p><i>Empty</i></p></div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" data-dismiss="modal">Close</button>
                    </div>
                </div><!-- /.modal-content -->
            </div><!-- /.modal-dialog -->
        </div><!-- /.modal -->
    </div>

</template>
<script>
    export default{
        props: {'items': {
                    type : Array,
                    default: () => []
                },
                'title': {
                    type: String,
                    default: 'List'
                },
                'disabled': {
                    type: Boolean,
                    default: false
                },
                'disabledMessage': {
                    type: String,
                    default: ''
                },
                'errorMessage': {
                    type: String,
                    default: 'This column is required'
                },
                'busy': {
                    type: Boolean,
                    default: false
                },
                'inputError': {
                    type: Boolean,
                    default: false
                }
        },
        data(){
            return{
                name : '',
                keyword: '',
                selectedPosition: -1,
                highlightedPosition: -1,
                value: -1,
                id : -1,
                scrollPos:0,
                isInputError: false
            }
        },
        methods: {
            select(){
                this.value = this.fItems[this.highlightedPosition].value;
                this.name = this.fItems[this.highlightedPosition].name;
                this.$emit('select', {'value' : this.value, 'name' : this.name});
                $('#' + this.id + '_dialog').modal('hide');

            },
            openDialog(){
                if(this.disabled){
                    alert(this.disabledMessage);
                }
                else {
                    $('#' + this.id + '_dialog').modal('show');
                    $('#' + this.id + '_input-dialog').focus();
                }
            },
            clear(){
                this.name='';
                this.keyword= '';
                this.selectedPosition= -1;
                this.highlightedPosition= -1;
                this.value= -1;
                this.id = -1;
                this.$emit('select', -1);
            },
            validate(){
                if(this.value>=1){
                    this.inputState='';
                }
                else{
                    this.inputState='has-error';
                }
            },
            moveUp(){
                this.highlightedPosition = this.highlightedPosition-1<0? this.highlightedPosition = this.fItems.length-1 : this.highlightedPosition-1;
                this.scrollUp();
            },
            moveDown(){
                this.highlightedPosition = this.highlightedPosition+1>this.fItems.length-1 ? this.highlightedPosition = 0 : this.highlightedPosition+1;
                this.scrollDown();
            },
            scrollDown(val = 1){
                try{
                    if($('.highlighted').position().top + $('.highlighted').height() > ($('.dialog-selector').height() - $('.highlighted').height() )){
                        if(this.highlightedPosition==0){
                            $('.dialog-selector').scrollTop(0);
                        }
                        else{
                            let maxItems = Math.floor($('.dialog-selector').height() / $('.highlighted').height());
                            let currentPos = Math.floor($('.highlighted').position().top/$('.highlighted').height())+1;
                            let scrollPos = $('.dialog-selector').scrollTop() + (((val - (maxItems - currentPos)) * ($('.highlighted').height()))-val);
                            //let scrollPos = $('.dialog-selector').scrollTop() + ($('.highlighted').height()*val) + val;
                            $('.dialog-selector').scrollTop(scrollPos);
                        }
                    }
                }
                catch ($e){

                }
            },
            scrollUp(val = 1){
                if($('.highlighted').position().top < $('.dialog-selector').position().top + $('.highlighted').height()){
                    if(this.highlightedPosition==this.fItems.length-1){
                        $('.dialog-selector').scrollTop( $('.dialog-selector').prop('scrollHeight'));
                    }
                    else{
                        let currentPos = Math.floor($('.highlighted').position().top/$('.highlighted').height())-1;
                        let scrollPos = $('.dialog-selector').scrollTop() - (((val - currentPos) * ($('.highlighted').height()))+val);
                        $('.dialog-selector').scrollTop(scrollPos);
                    }

                }
            },
            moveHome(){
                $('.dialog-selector').scrollTop( 0);
                this.highlightedPosition = 0;
            },
            moveEnd(){
                $('.dialog-selector').scrollTop( $('.dialog-selector').prop('scrollHeight'));
                this.highlightedPosition = this.fItems.length-1;
            },
            movePageUp(){
                if(this.highlightedPosition-6<0){
                    this.highlightedPosition = this.fItems-1;
                    this.moveEnd();
                }
                else{
                    this.highlightedPosition = this.highlightedPosition-6;
                    this.scrollUp(6);
                }

            },
            movePageDown(){
                if(this.highlightedPosition+3>this.fItems.length-6){
                    this.highlightedPosition = 0;
                    this.moveHome();
                }
                else{
                    this.highlightedPosition = this.highlightedPosition+6;
                    this.scrollDown(6);
                }
            }

        },
        computed:{
            fItems(){
                const re = new RegExp(this.keyword, 'i');
                return this.items.filter(o => o.name.match(re));
            },
            randomId(){
                return Math.floor(Math.random() * (10 - 1 + 1)) + 1;
            }
        },
        watch:{
            inputError(){
                this.isInputError = this.inputError;
            }
        },
        mounted : function(){
            this.isInputError = this.inputError;
            this.id = this._uid;
            let id = this.id;
        }
    }
</script>

<style scoped>
    ul.dialog-selector{
        padding-left: 0;
        flex-direction: column;
        max-height: 300px;
        flex: 1 1 auto;
        overflow-y: auto;
        margin:0;
    }
    ul.dialog-selector li p{
        margin: auto 0;

    }
    .ui-search .form-group{
        padding:10px;
        margin: 0;
        background-color: #e6e6e6;
        cursor: pointer;
    }
    li.list-item{
        padding-left: 15px;
        display: flex;
        height: 50px;
        border-bottom: 1px solid #e0e0e0;
    }
    li.list-item:nth-last-child(1){
        border: none;
    }
    li.highlighted{
        background: #f8f8f8;
        cursor: pointer;
    }
    .input-text{

    }
    .modal-body{
        padding:0
    }

/*Spinner*/
    .spinner {
        margin: 0 !important;
        width: 24px;
        height: 24px;
        position: relative;
        text-align: center;

        -webkit-animation: sk-rotate 2.0s infinite linear;
        animation: sk-rotate 2.0s infinite linear;
    }

    .dot1, .dot2 {
        width: 50%;
        height: 50%;
        display: inline-block;
        position: absolute;
        top: 0;
        background-color: #333;
        border-radius: 100%;

        -webkit-animation: sk-bounce 2.0s infinite ease-in-out;
        animation: sk-bounce 2.0s infinite ease-in-out;
    }

    .dot2 {
        top: auto;
        bottom: 0;
        -webkit-animation-delay: -1.0s;
        animation-delay: -1.0s;
    }

    @-webkit-keyframes sk-rotate { 100% { -webkit-transform: rotate(360deg) }}
    @keyframes sk-rotate { 100% { transform: rotate(360deg); -webkit-transform: rotate(360deg) }}

    @-webkit-keyframes sk-bounce {
        0%, 100% { -webkit-transform: scale(0.0) }
        50% { -webkit-transform: scale(1.0) }
    }

    @keyframes sk-bounce {
        0%, 100% {
            transform: scale(0.0);
            -webkit-transform: scale(0.0);
        } 50% {
              transform: scale(1.0);
              -webkit-transform: scale(1.0);
          }
    }
</style>