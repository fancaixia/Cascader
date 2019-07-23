// 初始化功能
function initSelector(selector_box,nav_box,panel_box,options){

    selectorHandle.call(this,selector_box,nav_box,panel_box,options)

    // 选择器样式设置
    this.selector_box.css({width:this.options.selector_width})
    this.nav_box.css({width:this.options.nav_width,height:this.options.nav_height,lineHeight:this.options.nav_height})
    this.panel_box.css({width:this.options.panel_width,height:this.options.panel_height})
    // root_ico 为 false  隐藏图标
    if(!this.options.root_ico){
        this.nav_box.css({background:'none',padding:'4px 10px'})
    }
    // 导航面板默认文本
    this.nav_box.html(`<p class="text_placeholder">${this.options.nav_default_text}</p>`)
}

function selectorHandle(selector_box,nav_box,panel_box,options){

    // 导航器默认配置
    let default_options = {
        selector_width:500,   // 整个选择器的宽度
        nav_width:'100%', // 导航条 宽度
        nav_height:36,    // 导航条高度
        nav_default_text:'请选择省 / 市',  // 初始化时导航条默认文本
        panel_width:'100%', //选择器面板宽度
        panel_height:200,   // 选择器面板高度
        root_ico:true,      // Boolean值 false不显示  true显示
    }
    // 检测并合并options 参数
    this.options = options?$.extend(default_options,options):default_options;
    this.selector_box = $(selector_box);
    this.nav_box = $(nav_box);
    this.panel_box = $(panel_box);

    this.show_panel = false;   // 导航面板默认关闭
    this.panel_box.hide()
    this.panel_data = [];  // 面板数据
    this.nav_data = [];    // 导航条数据
    this.currentEleParentId = 0;  // 当前点击对象的父id, 根据父id获取当前元素所有同类
    this.currentLevel = 1; // 当前层级  1为省级数据   2为市   3为县
    this.currentId = null;  // 当前导航点击元素id

    // 点击导航条事件
    this.nav_box.on('click',(item)=>{
 
        // 判断点击div则parent_id = 0(请求根目录数据)  
        // LI的话为自己parent_id

        if(item.target.nodeName == 'LI'){
            this.currentEleParentId = item.target.dataset.parentid;
            this.currentLevel = item.target.dataset.level;
            this.currentId = item.target.dataset.id;
        }else{
            this.currentEleParentId = 0;
            this.currentLevel = 1;
            this.currentId = null;
        }
        
        this.show_panel = !this.show_panel;
        // 更新选择器面板
        this.update_panel()

    })
    // 点击面板数据
    this.panel_box.on('click','li',(item)=>{
  
        let {id,name,parentid,level} = item.currentTarget.dataset;
        
        // 更新导航数据
        this.setNavData(id,name,parentid,level);

        // 更新请求参数
        this.currentEleParentId = id;
        this.currentLevel = Number(level) + 1;

        // 更新导航条
        this.update_nav();
        // 更新面板
        this.update_panel();

        // 触发回调事件
        this.onClickfn({id,name,parentid,level});

    })
    // 更新导航条数据
    this.setNavData = function(id,name,parentid,level){
        
        if(level == 1){

            this.nav_data.length = 0;
            this.nav_data.push({id,name,parentid,level})

        }else if(level == 2){

            this.nav_data.length = 1;
            this.nav_data.push({id,name,parentid,level})

        }else if(level == 3){

            this.nav_data.length = 2;
            this.nav_data.push({id,name,parentid,level})

        }
    }

    // 更新导航条
    this.update_nav = function(){

        let nav_str = '<ul>'
        this.nav_data.forEach((item,index)=>{
            // data-id(item自己的id)  data-parentid(item父id)  data-level(当前点击元素的层级（省/市/县）)
            nav_str += `<li data-level='${index+1}' data-id='${item.id}' data-parentid='${item.parentid}'>${item.name}</li>`
        })
        this.nav_box.html(nav_str)
      
    }

    // 更新导航面板
    this.update_panel = function(){

        if(this.show_panel){
            
            // 请求面板数据参数
            const options = this.getOptions();

            Request(options).then((data)=>{

                this.panel_data = data.data;

                // 空数据的话就关闭面板
                if(this.panel_data.length == 0){
                    this.show_panel = false;
                    this.panel_box.hide();
                    return;
                }
                // 动态生成 panel 面板内容
                let panel_str = '<ul>'
                this.panel_data.forEach((item,index)=>{

                    // 等于当前点击的元素  那么添加class
                    panel_str += `<li class='${this.currentId == item.id?'current':''}' data-id='${item.id}' data-level='${item.level}' data-parentid='${item.parentid}' data-name='${item.name}'>${item.name}</li>`
                })
                this.panel_box.html(panel_str)
                this.panel_box.show()

            })

        }else{
            this.panel_box.hide()
        }

    }
    
}

