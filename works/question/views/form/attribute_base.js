define ( ['jquery'] , function ( $ , layer ) {
    'use strict';

    return {

        label          : function ( json , eInput ) {

            var $label = this.find ( '.jc-ctl-label' );
            var $area = this.find ( '.jc-ctl-area' );
            var value = eInput.value; //.replace ( /\s+/g , '' );

            var one = this.data ( 'one' );

            if ( value.replace ( /\s+/g , '' ).length && !one ) {
                this.prev ().find ( '.jc-col-valid-label' ).remove ();

                if ( !this.prev ().find ( 'li' ).length ) {
                    this.prev ().hide ();
                    this.data ( 'one' , true );
                }

            }

            $label.text ( value );
        }
        ,
        value          : function ( json , eInput ) {
            var $value = this.find ( '.jc-ctl-value' );
            var value = parseInt ( eInput.value );
            value = !$.isNumeric ( value ) ? json.valid.min : value;
            value = value > json.valid.max ? json.valid.max : value;
            value = value < json.valid.min ? json.valid.min : value;
            $value.val ( value );
            eInput.value = value;

        } ,
        fname          : function ( json , eInput ) {
            var value = eInput.value.length ? eInput.value : '&nbsp;';

            var one = this.data ( 'one' );

            if ( value.replace ( /\s+/g , '' ).length && !one ) {
                this.prev ().find ( '.jc-col-valid-label' ).remove ();

                if ( !this.prev ().find ( 'li' ).length ) {
                    this.prev ().hide ();
                    this.data ( 'one' , true );
                }

            }
            this.html ( value );
        }
        ,
        optionsChecked : function ( json , option ) {
            switch ( option.type ) {
                case 'radio':
                    var aRadio = this.find ( ':' + option.type ).prop ( 'checked' , false );
                    aRadio.eq ( option.index ).prop ( 'checked' , option.checked );
                    break;
                case 'checkbox':
                    this.find ( ':checkbox' ).eq ( option.index ).prop ( 'checked' , option.checked );
                    break;
                case 'select':
                    $ ( 'select option' , this ).eq ( option.index ).prop ( 'selected' , true );
                    break;
            }

        }
        ,
        optionsText    : function ( json , option ) {
            var one = this.data ( 'one' );

            var result = true;

            if ( !one ) {

                for ( var i = 0 , l = json.options.length; i < l; i++ ) {
                    if ( !json.options[i].text.replace ( /\s+/g , '' ).length ) {
                        result = false;
                        break;
                    }
                }
                if ( result ) {
                    this.prev ().find ( '.jc-col-valid-option' ).remove ();
                    if ( !this.prev ().find ( 'li' ).length ) {
                        this.prev ().hide ();
                        this.data ( 'one' , true );
                    }

                }

            }

            switch ( option.type ) {
                case 'radio':
                case 'checkbox':
                    this.find ( ':' + option.type ).eq ( option.index ).parent ().next() .text ( option.text );
                    break;
                case 'select':

                    $ ( 'select option' , this ).eq ( option.index ).text ( option.text );
                    break;
            }

        }

    }

} );

