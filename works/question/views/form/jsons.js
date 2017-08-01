define ( function () {

    return [

        { col : 'common' , type : 'form' , fname : '表单名称123' , wrap : 'form' } ,
        {
            col     : 'common' ,
            cate    : 'line' ,
            type    : 'radio' ,
            label   : '单选题' ,
            valid   : { required : false } ,
            options : [
                { value : 0 , text : '选项1' , checked : false } ,
                { value : 1 , text : '选项2' , checked : false } ,
                { value : 2 , text : '选项3' , checked : false }
            ] ,
            name    : 'js_col_0_1_0_radio' ,
            wrap    : 'js_col_0_1_0' ,
            qId     : 1
        } ,
        {
            col   : 'common' ,
            type  : 'number' ,
            label : '分值题' ,
            value : 0 ,
            valid : { required : false , min : 0 , max : 999 } ,
            name  : 'js_col_1_1_0_number' ,
            wrap  : 'js_col_1_1_0' ,
            qId   : 2
        } ,
        {
            col     : 'common' ,
            type    : 'checkbox' ,
            label   : '多选题' ,
            valid   : { required : false } ,
            options : [
                { value : 0 , text : '选项1' , checked : false } ,
                { value : 1 , text : '选项2' , checked : false } ,
                { value : 2 , text : '选项3' , checked : false }
            ] ,
            name    : 'js_col_2_1_0_checkbox' ,
            wrap    : 'js_col_2_1_0' ,
            qId     : 3
        } ,
        {
            col     : 'common' ,
            type    : 'select' ,
            label   : '选择列表' ,
            valid   : { required : false } ,
            options : [
                { value : 0 , text : '选项1' , checked : false } ,
                { value : 1 , text : '选项2' , checked : false } ,
                { value : 2 , text : '选项3' , checked : false }
            ] ,
            name    : 'js_col_3_1_0_select' ,
            wrap    : 'js_col_3_1_0' ,
            qId     : 4
        } ,
        {
            col     : 'common' ,
            cate    : 'line' ,
            type    : 'radio' ,
            label   : '单选题' ,
            valid   : { required : false } ,
            options : [
                { value : 0 , text : '选项1' , checked : false } ,
                { value : 1 , text : '选项2' , checked : false } ,
                { value : 2 , text : '选项3' , checked : false }
            ] ,
            name    : 'js_col_4_1_0_radio' ,
            wrap    : 'js_col_4_1_0' ,
            qId     : 5
        } ,
        {
            col   : 'common' ,
            type  : 'number' ,
            label : '分值题' ,
            value : 0 ,
            valid : { required : false , min : 0 , max : 999 } ,
            name  : 'js_col_5_1_0_number' ,
            wrap  : 'js_col_5_1_0' ,
            qId   : 6
        } ,
        {
            col     : 'common' ,
            type    : 'checkbox' ,
            label   : '多选题' ,
            valid   : { required : false } ,
            options : [
                { value : 0 , text : '选项1' , checked : false } ,
                { value : 1 , text : '选项2' , checked : false } ,
                { value : 2 , text : '选项3' , checked : false }
            ] ,
            name    : 'js_col_6_1_0_checkbox' ,
            wrap    : 'js_col_6_1_0' ,
            qId     : 7
        } ,
        {
            col     : 'common' ,
            type    : 'select' ,
            label   : '选择列表' ,
            valid   : { required : false } ,
            options : [
                { value : 0 , text : '选项1' , checked : false } ,
                { value : 1 , text : '选项2' , checked : false } ,
                { value : 2 , text : '选项3' , checked : false }
            ] ,
            name    : 'js_col_7_1_0_select' ,
            wrap    : 'js_col_7_1_0' ,
            qId     : 8
        } ,
        {
            col     : 'common' ,
            type    : 'select' ,
            label   : '选择列表' ,
            valid   : { required : false } ,
            options : [
                { value : 0 , text : '选项1' , checked : false } ,
                { value : 1 , text : '选项2' , checked : false } ,
                { value : 2 , text : '选项3' , checked : false }
            ] ,
            name    : 'js_col_8_1_0_select' ,
            wrap    : 'js_col_8_1_0' ,
            qId     : 9
        } ,
        {
            col     : 'common' ,
            cate    : 'line' ,
            type    : 'radio' ,
            label   : '单选题' ,
            valid   : { required : false } ,
            options : [
                { value : 0 , text : '选项1' , checked : false } ,
                { value : 1 , text : '选项2' , checked : false } ,
                { value : 2 , text : '选项3' , checked : false }
            ] ,
            name    : 'js_col_9_1_0_radio' ,
            wrap    : 'js_col_9_1_0' ,
            qId     : 10
        }

    ]

} );