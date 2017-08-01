define ( ['./formBuilder' , './jsons'] , function ( fbuilder ,json) {
    'use strict';




    fbuilder ( {

        url         : '/form/save' ,
        data:json,

        saveBack : function ( data ) {
            console.log(data);
         /*   $.ajax ( {
                url         : '/form/save' ,
                method      : 'post' ,
                data        : JSON.stringify ( data ) ,
                contentType : 'application/json; charset=utf-8' ,
                success     : function ( data ) {
                    console.log ( 123 );
                }
            } );*/
        }

    } );
} );