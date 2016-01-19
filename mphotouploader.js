/* Ajax File Upload - v0.6 ( https://github.com/valums/ajax-upload ) */
;(function ($){if(!$){return ;} ;$["ajax_upload"]=function (button,options){button=$(button);if(button["size"]()!=1){console["error"]("You passed ",button["size"]()," elements to ajax_upload at once");return false;} ;return  new Ajax_upload(button,options);} ;var get_uid=function (){var uid=0;return function (){return uid++;} ;} ();var Ajax_upload=function (button,options){this["button"]=button;this["wrapper"]=null;this["form"]=null;this["input"]=null;this["iframe"]=null;this["disabled"]=false;this["submitting"]=false;this["settings"]={action:"upload.php",name:"userfile",data:{},onSubmit:function (file,extension){} ,onComplete:function (file,response){} ,onSuccess:function (file){} ,onError:function (file,response){} };$["extend"](this["settings"],options);this["create_wrapper"]();this["create_input"]();if(jQuery["browser"]["msie"]){this["make_parent_opaque"]();} ;this["create_iframe"]();} ;Ajax_upload["prototype"]={set_data:function (data){this["settings"]["data"]=data;} ,disable:function (){this["disabled"]=true;if(!this["submitting"]){this["input"]["attr"]("disabled",true);} ;} ,enable:function (){this["disabled"]=false;this["input"]["attr"]("disabled",false);} ,create_wrapper:function (){var button=this["button"],wrapper;wrapper=this["wrapper"]=$("\x3Cdiv\x3E\x3C/div\x3E")["insertAfter"](button)["append"](button);setTimeout(function (){wrapper["css"]({position:"relative",display:"block",overflow:"hidden",height:button["outerHeight"](true),width:button["outerWidth"](true)});} ,1);var self=this;wrapper["mousemove"](function (e){if(!self["input"]){return ;} ;self["input"]["css"]({top:e["pageY"]-wrapper["offset"]()["top"]-5+"px",left:e["pageX"]-wrapper["offset"]()["left"]-170+"px"});} );} ,create_input:function (){var self=this;this["input"]=$("\x3Cinput type=\x22file\x22 /\x3E")["attr"]("name",this["settings"]["name"])["css"]({"position":"absolute","margin":0,"padding":0,"width":"220px","heigth":"10px","opacity":0,"cursor":"pointer"})["change"](function (){if($(this)["val"]()==""){return ;} ;self["submitting"]=true;self["submit"]();self["submitting"]=false;} )["appendTo"](this["wrapper"])["hover"](function (){self["button"]["addClass"]("hover");} ,function (){self["button"]["removeClass"]("hover");} );if(this["disabled"]){this["input"]["attr"]("disabled",true);} ;} ,create_iframe:function (){var name="iframe_au"+get_uid();this["iframe"]=$("\x3Ciframe name=\x22"+name+"\x22\x3E\x3C/iframe\x3E")["css"]("display","none")["appendTo"]("body");} ,submit:function (){var self=this,settings=this["settings"];var file=this["file_from_path"](this["input"]["val"]());if(settings["onSubmit"]["call"](this,file,this["get_ext"](file))===false){if(self["disabled"]){this["input"]["attr"]("disabled",true);} ;return ;} ;this["create_form"]();this["input"]["appendTo"](this["form"]);this["form"]["submit"]();this["input"]["remove"]();this["input"]=null;this["form"]["remove"]();this["form"]=null;this["submitting"]=false;this["create_input"]();var iframe=this["iframe"];iframe["load"](function (){var response=iframe["contents"]()["find"]("body")["html"]();settings["onComplete"]["call"](self,file,response);if(response=="success"){settings["onSuccess"]["call"](self,file);} else {settings["onError"]["call"](self,file,response);} ;setTimeout(function (){iframe["remove"]();} ,1);} );this["create_iframe"]();} ,create_form:function (){this["form"]=$("\x3Cform method=\x22post\x22 enctype=\x22multipart/form-data\x22\x3E\x3C/form\x3E")["appendTo"]("body")["attr"]({"action":this["settings"]["action"],"target":this["iframe"]["attr"]("name")});for(var i in this["settings"]["data"]){$("\x3Cinput type=\x22hidden\x22 /\x3E")["appendTo"](this["form"])["attr"]({"name":i,"value":this["settings"]["data"][i]});} ;} ,file_from_path:function (file){var i=file["lastIndexOf"]("\x5C");if(i!==-1){return file["slice"](i+1);} ;return file;} ,get_ext:function (file){var i=file["lastIndexOf"](".");if(i!==-1){return file["slice"](i+1);} ;return "";} ,make_parent_opaque:function (){this["button"]["add"](this["button"]["parents"]())["each"](function (){var color=$(this)["css"]("backgroundColor");var image=$(this)["css"]("backgroundImage");if(color!="transparent"||image!="none"){$(this)["css"]("opacity",1);return false;} ;} );} };} )(jQuery);



/*
 * Mantella photoUploader v0.1 plugin
 * Copyright (c) 2014 Vasilij Olhov
 * Dual licensed under the MIT and GPL licenses
*/
;(function($) {

    // ================================================
    // =============== DEFAULT OPTIONS ================
    // ================================================
    var defaults = {
    				 url	: './upload/', // path to upload file
					 params	: {},          // additional parameter for server on file upload
      				 name	: 'myfile',    // variables name of file content
           			 photo	: null,        // default path to photo
					 locale : {					 	exten_error: 'File {filename} is not image',
					 	fatal_error: 'Fatal error'					 },
					 onSuccess	: null,   // callback function
					 onError	: null    // callback function
	};



	// ================================================
    // =============== EXTERNAL METHODS ===============
    // ================================================
    var methods = {

        // === Initailization ===
        init: function(params) {
            var me = this;

        	// merge options and remember -----
        	var options = $.extend(true, {}, defaults, params);
            me.data('options',options);

            // stilyzing
            me.addClass('photouploader-container');
		    setPhoto.call( me, options.photo );


		    // add hidden blocks
		    me.append('<div class="photouploader-progress"></div>')
			  .append('<div class="photouploader-icon"></div>');

            // bind actions
            bindActions.call(me);

            return me;
        },


        // ==== Set new photo, or unset if 'path' is null ====
    	setPhoto: function( path ) {
        	var me = this;

        	// remeber new value
        	var options = me.data('options');
        	options.photo = path;
        	me.data('options',options);

        	// set image
        	setPhoto.call(me, options.photo );

     		return me;
        },

        setParams: function( params ) {
        	var me = this;

        	// remeber new params
        	var options = me.data('options'),
        		plugin	= me.data('plugin');

        	options.params = $.extend( options.params, params );
        	me.data('options',options);

        	// transmit params into plugin
        	plugin.set_data( options.params );

        	return me;
    	}


    };



    // =================================================
    // ================ BIND ACTIONS ===================
    // =================================================

    var bindActions = function() {
        var me = this,
        	options = me.data('options');


        // Setup AjaxFileUploader plugin
		var plugin = $.ajax_upload( $(this), {
        				action 	: options.url,
				        name	: options.name,
				        data	: options.params,
				        onSubmit	: function(file, ext) {
            							var root = this.button;
						            	if ( !(ext && /^(jpg|png|jpeg|gif)$/i.test(ext)) ) {
                							reg = new RegExp( '{filename}', 'ig' );
						                	if (options.onError) { options.onError.call( me, options.locale.exten_error.replace( reg, file ) ); }
						                	return false;
						            	}
						            	me.css('background-image', 'none');
            							me.find('div.photouploader-progress').show();
						            	me.find('div.photouploader-icon').hide();

        				},
				        onComplete	: function(file, response) {
										var resp = {};

            						  	me.find('div.photouploader-progress').hide();

            						  	try { resp = eval('(' + response + ')'); }
						              	catch(e) { resp = { success:false, message: options.locale.fatal_error }; }

            							if ( resp.success ) {
							                setPhoto.call(me, resp.data );
                							if (options.onSuccess) { options.onSuccess.call( me, resp.data ); }
							            }
            							else {
							                if (options.onError) { options.onError.call( me, resp.data ); }
            							}
        				}
		});

        me.data('plugin',plugin);

		// Mouse hover on photo -> show/hide icon
    	var input = me.parent('div').first().find('input[type="file"][name="'+options.name+'"]');
    	input.on('mouseenter', function() { me.find('div.photouploader-icon').show(); })
    		 .on('mouseleave', function() { me.find('div.photouploader-icon').hide(); });



	}; // end bind action




    // =================================================
    // ================ HELPER FUNCTION ================
    // =================================================
	var setPhoto = function( path ) {
        this.css('background-image', ( path ? "url('"+path+"')" : "none" ) );
	};



    // =================================================
    // ============ EXTERNAL ENTRY POINT ===============
    // =================================================
    $.fn.mPhotoUploader = function(methodOrOptions) {
        if ( methods[methodOrOptions] ) { return methods[ methodOrOptions ].apply( this, Array.prototype.slice.call( arguments, 1 )); }
        else if ( typeof methodOrOptions === 'object' || ! methodOrOptions ) { return methods.init.apply( this, arguments ); }
        else { return false; }
    };


})(jQuery);
