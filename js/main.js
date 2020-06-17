class ViewMainPage {
    constructor(myf) {
        this.options = ["option_A", "option_B", "option_C"];
        this.myf = myf;
    }
    showTitle(filter) {
        let title = this.myf.getElementById("title_");
        switch (filter) {
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
    showProgress() {
        let devicesUl = this.myf.getElementById("devicesList");
        devicesUl.innerHTML = "<li style='padding:5px'><div class='progress'><div class='indeterminate'></div></div></li>";
    }
    showDevices(list, filter) {
        // cargo la lista de objetos en el DOM
        let devicesUl = this.myf.getElementById("devicesList");
        let title = this.myf.getElementById("title_");
        devicesUl.innerHTML = "";
        let items = "";
        let type = "";
        title.innerText = title.innerText + ' (' + list.length + ')';
        for (let i in list) {
            type = list[i].type.toString();
            let checkedStr = "";
            if (list[i].state == "1")
                checkedStr = "checked";
            switch (type) {
                case "0": // Lampara                     
                    items += "<li class='collection-item avatar'> \
                                <img src='images/lightbulb.png' alt='' class='circle'> \
                                <span class='title'>" + list[i].name + "</span> \
                                <p>" + list[i].description + "<br> \
                                </p> \
                                <a href='#!' class='secondary-content'> <div class='switch'> \
                                                                            <label> \
                                                                            Off \
                                                                            <input type='checkbox' id='dev_" + list[i].id + "' " + checkedStr + "> \
                                                                            <span class='lever'></span> \
                                                                            On \
                                                                            </label> \
                                                                        </div></a> \
                            </li>";
                    break;
                case "1": // Persiana                    
                    items += "<li class='collection-item avatar'> \
                                <img src='images/window.png' alt='' class='circle'> \
                                <span class='title'>" + list[i].name + "</span> \
                                <p>" + list[i].description + "<br> \
                                </p> \
                                <a href='#!' class='secondary-content'> <div class='switch'> \
                                                                            <label> \
                                                                            Off \
                                                                            <input type='checkbox' id='dev_" + list[i].id + "' " + checkedStr + "> \
                                                                            <span class='lever'></span> \
                                                                            On \
                                                                            </label> \
                                                                        </div></a> \
                            </li>";
                    break;
            }
        }
        devicesUl.innerHTML = items;
    }
    getSwitchStateById(id) {
        let el = this.myf.getElementById(id);
        return el.checked;
    }
}
class Main {
    constructor() {
        this.qryStr = "devices?filter=";
        this.current_filter = -1;
    }
    handleEvent(evt) {
        let id = this.myf.getId(evt);
        if (id.length > 0) {
            let opt = this.view.options.indexOf(id);
            if (opt >= 0) {
                this.applyFilter(opt);
                return;
            }
        }
        let sw = this.myf.getElementByEvent(evt);
        let data = { "id": sw.id, "state": this.view.getSwitchStateById(sw.id) };
        this.updateStatusSensor(data);
    }
    handleGETResponse(status, response) {
        if (status == 200) {
            let data = JSON.parse(response);
            this.view.showDevices(data, this.current_filter.toString());
            for (let i in data) {
                let sw = this.myf.getElementById("dev_" + data[i].id);
                if (sw)
                    sw.addEventListener("click", this);
            }
        }
    }
    handlePOSTResponse(status, response) {
        if (status == 200) {
            console.log(response);
        }
    }
    applyFilter(filter) {
        if (this.current_filter == filter)
            return;
        this.current_filter = filter;
        var self = this;
        this.view.showTitle(self.current_filter.toString());
        this.view.showProgress();
        setTimeout(function () {
            self.myf.requestGET(self.qryStr + self.current_filter.toString(), self);
        }, 500);
    }
    updateStatusSensor(data) {
        this.myf.requestPOST("devices", data, this);
    }
    configToolbar() {
        let toolbar = this.myf.getElementById("toolbar");
        let options = toolbar.getElementsByTagName("a");
        for (let item of options) {
            item.addEventListener("click", this, false);
        }
    }
    main() {
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
