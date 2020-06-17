interface DeviceInt{
    id:string;
    name:string;
    description:string;
    state:string;
    type:string;
}
class ViewMainPage
{
    private myf:MyFramework;   
    public options: Array<string> = ["option_A", "option_B", "option_C"];    

    constructor(myf:MyFramework)
    {
        this.myf = myf;       
    }  
    
    showTitle(filter: string): void {
        let title:HTMLElement = this.myf.getElementById("title_");
        switch(filter)
        {
            case "1":
                title.innerText = "Lamparas";
                break;
            case "2":
                title.innerText = "Percianas";
                break;
            default:
                title.innerText = "Dispositivos";
                break;
        }
    } 
    
    showProgress():void {
        let devicesUl:HTMLElement = this.myf.getElementById("devicesList");
        devicesUl.innerHTML="<li style='padding:5px'><div class='progress'><div class='indeterminate'></div></div></li>";
    }

    showDevices(list:DeviceInt[], filter: string):void
    {
        // cargo la lista de objetos en el DOM
        let devicesUl:HTMLElement = this.myf.getElementById("devicesList");
        let title:HTMLElement = this.myf.getElementById("title_");
        
        devicesUl.innerHTML = "";
        let items:string="";
        let type: string ="";
        title.innerText = title.innerText + ' (' + list.length + ')';
        for(let i in list)
        {   
            type = list[i].type.toString();
            let checkedStr="";
            if(list[i].state=="1")
                checkedStr="checked";

            switch(type)
            {
                case "0": // Lampara                     
                    items+="<li class='collection-item avatar'> \
                                <img src='images/lightbulb.png' alt='' class='circle'> \
                                <span class='title'>"+list[i].name+"</span> \
                                <p>"+list[i].description+"<br> \
                                </p> \
                                <a href='#!' class='secondary-content'> <div class='switch'> \
                                                                            <label> \
                                                                            Off \
                                                                            <input type='checkbox' id='dev_"+list[i].id+"' "+checkedStr+"> \
                                                                            <span class='lever'></span> \
                                                                            On \
                                                                            </label> \
                                                                        </div></a> \
                            </li>";  
                    break;  
                case "1": // Persiana                    
                    items+="<li class='collection-item avatar'> \
                                <img src='images/window.png' alt='' class='circle'> \
                                <span class='title'>"+list[i].name+"</span> \
                                <p>"+list[i].description+"<br> \
                                </p> \
                                <a href='#!' class='secondary-content'> <div class='switch'> \
                                                                            <label> \
                                                                            Off \
                                                                            <input type='checkbox' id='dev_"+list[i].id+"' "+checkedStr+"> \
                                                                            <span class='lever'></span> \
                                                                            On \
                                                                            </label> \
                                                                        </div></a> \
                            </li>";  
                    break;                                                    
            }            
            
        }

        devicesUl.innerHTML=items;
    }

    getSwitchStateById(id:string):boolean {
        let el:HTMLInputElement = <HTMLInputElement>this.myf.getElementById(id);       
        return el.checked;
    }
}

class Main implements GETResponseListener, EventListenerObject
{ 
    qryStr: string = "devices?filter=";
    current_filter: number = - 1;    
    myf: MyFramework;
    view: ViewMainPage;    

    handleEvent(evt:Event):void
    {
        let id: string = this.myf.getId(evt);

        if (id.length > 0) {
            let opt: number = this.view.options.indexOf(id);
            if (opt >= 0) {
                this.applyFilter(opt); 
                return;
            }               
        }

        let sw: HTMLElement = this.myf.getElementByEvent(evt);        
        let data:object = {"id":sw.id,"state":this.view.getSwitchStateById(sw.id)};
        this.updateStatusSensor(data);
    }

    handleGETResponse(status:number,response:string){
      if(status==200)
      {
          let data:DeviceInt[] = JSON.parse(response);
          this.view.showDevices(data, this.current_filter.toString());    
          
          for(let i in data)
          {
              let sw:HTMLElement = this.myf.getElementById("dev_"+data[i].id);
              if (sw) sw.addEventListener("click",this);              
          }
       }
    }    

    handlePOSTResponse(status:number,response:string):void{
        if(status==200)
        {
            console.log(response);
        }
    }

    applyFilter(filter: number): void {        
        if (this.current_filter == filter) return;        
        this.current_filter = filter;
        var self: Main = this;
        this.view.showTitle(self.current_filter.toString());       
        this.view.showProgress();        
        setTimeout(function() {
            self.myf.requestGET(self.qryStr + self.current_filter.toString(), self);            
        }, 500);
    }

    updateStatusSensor(data:object): void {
        this.myf.requestPOST("devices",data,this);
    }

    configToolbar():void {
        let toolbar:HTMLElement = this.myf.getElementById("toolbar");
        let options: HTMLCollectionOf<HTMLAnchorElement> = toolbar.getElementsByTagName("a");          
        
        for (let item of options) {
            item.addEventListener("click",this, false);
        }            
    }

    main():void 
    { 
      this.myf = new MyFramework();
      this.view = new ViewMainPage(this.myf);  
     
      this.configToolbar();      
      this.applyFilter(0);      
    } 
} 
 
window.onload = () => {
    let obj = new Main(); 
    obj.main();
};
 

