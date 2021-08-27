<template>
  <div class="rightmouse-panel-div" ref="contexmenu_excel" @mouseleave="closeRightPanel">
    <div class="panel-div-left">
      <!-- <div class='wb duiqifangsi'>
                    <span class='excel-rightmomuse-icon-css'><i class='fa fa-th'></i></span>
                    <span class='excel-rightmomuse-text-css'>对齐方式</span>
                    <span class='excel-rightmomuse-icon-css excel-rightmomuse-icon-next-css'><i class='fa fa-caret-right'></i></span>
                </div> -->
      <!-- <div class='wb hebingdanyuange'>
                        <span class='excel-rightmomuse-icon-css'><i class='fa fa-columns'></i></span>
                        <span class='excel-rightmomuse-text-css'>合并单元格</span>
                    </div> -->
      <!-- <div class='wb fuzhidanyuange'>
            <span class='excel-rightmomuse-icon-css'><i class='fa fa-columns'></i></span>
            <span class='excel-rightmomuse-text-css'>复制单元格样式</span>
        </div>
        <div class='wb zhantiedanyuange'>
            <span class='excel-rightmomuse-icon-css'><i class='fa fa-columns'></i></span>
            <span class='excel-rightmomuse-text-css'>粘贴单元格样式</span>
        </div>
        <div class='hr'></div> -->
      <div class="wb shangchayihang">
        <span class="excel-rightmomuse-icon-css"
          ><i class="fa fa-angle-up"></i></span
        ><span
          class="excel-rightmomuse-text-css"
          @click="addRowCol('addbefore')"
          >上方插入一行</span
        >
      </div>
      <div class="wb xiachayihang">
        <span class="excel-rightmomuse-icon-css"
          ><i class="fa fa-angle-down"></i></span
        ><span class="excel-rightmomuse-text-css" @click="addRowCol('addafter')"
          >下方插入一行</span
        >
      </div>
      <div class="wb zuochayilie">
        <span class="excel-rightmomuse-icon-css"
          ><i class="fa fa-angle-left"></i></span
        ><span class="excel-rightmomuse-text-css" @click="addRowCol('addleft')"
          >左边插入一列</span
        >
      </div>
      <div class="wb youchayilie">
        <span class="excel-rightmomuse-icon-css"
          ><i class="fa fa-angle-right"></i></span
        ><span class="excel-rightmomuse-text-css" @click="addRowCol('addright')"
          >右边插入一列</span
        >
      </div>
      <div class="hr"></div>
      <div class="wb shanchuhang">
        <span class="excel-rightmomuse-icon-css"
          ><i class="fa fa-minus-square-o"></i></span
        ><span class="excel-rightmomuse-text-css" @click="addRowCol('delrow')"
          >删除行</span
        >
      </div>
      <div class="wb shanchulie">
        <span span class="excel-rightmomuse-icon-css"
          ><i class="fa fa-minus-square"></i></span
        ><span class="excel-rightmomuse-text-css" @click="addRowCol('delcol')"
          >删除列</span
        >
      </div>

      <!-- <div class='wb chexiao' title='只能结构改变撤销'>
            <span class='excel-rightmomuse-icon-css'><i class='fa fa-reply-all'></i></span><span class='excel-rightmomuse-text-css'>撤销</span>
        </div>
-->
<!--      <div class="wb setting">
        <span class="setting-item"
          ><span class="setting-text">宽</span
          ><span class="setting-input"
            ><input type="text" name="width" title="单元格宽度" /></span></span
        ><span class="setting-item"
          ><span class="setting-text">行</span
          ><span class="setting-input"
            ><input type="text" name="row" /></span></span
        ><span class="setting-item"
          ><span class="setting-text">列</span
          ><span class="setting-input"><input type="text" name="col" /></span
        ></span>
      </div> -->
    </div>
    <!-- <div class='panel-div-right'>
        <div class='wb juzhong'><span class='excel-rightmomuse-icon-css'><i class='fa fa-align-justify'></i></span><span class='excel-rightmomuse-text-css'>居中</span></div>
        <div class='wb zuoduiqi'><span class='excel-rightmomuse-icon-css'><i class='fa fa-align-left'></i></span><span class='excel-rightmomuse-text-css'>左对齐</span></div>
        <div class='wb youduiqi'><span class='excel-rightmomuse-icon-css'><i class='fa fa-align-right'></i></span><span class='excel-rightmomuse-text-css'>右对齐</span></div>
        <div class='hr'></div>
        <div class='wb chuizhijuzhong'><span class='excel-rightmomuse-icon-css'><i class='fa fa-navicon'></i></span><span class='excel-rightmomuse-text-css'>垂直居中</span></div>
        <div class='wb dingduanduiqi'><span class='excel-rightmomuse-icon-css'><i class='fa fa-angle-double-up'></i></span><span class='excel-rightmomuse-text-css'>顶端对齐</span></div>
        <div class='wb dibuduiqi'><span class='excel-rightmomuse-icon-css'><i class='fa fa-angle-double-down'></i></span><span class='excel-rightmomuse-text-css'>底部对齐</span></div>
        </div> -->
  </div>
</template>
<script>
export default {
  name: "MouseRightPanel",
  props: {
    axis: {
      type: Object,
      required: false,
      default() {
        return {
          x: null,
          y: null,
        };
      },
    },
  },
  watch: {
    axis: {
      handler(val) {
        var x = val.x;
        var y = val.y;
        var innerWidth = window.innerWidth;
        var innerHeight = window.innerHeight;
        var _this = this;
        var menu = this.$refs.contexmenu_excel;
        menu.style.display = "block";
        var menuHeight = 184;
        var menuWidth = 120;
        menu.style.top =
          (y + menuHeight > innerHeight ? innerHeight - menuHeight : y) + "px";
        menu.style.left =
          (x + menuWidth > innerWidth ? innerWidth - menuWidth : x) + "px";
        // menu.addEventListener(
        //   "mouseup",
        //   function (e) {
        //     // 解决mac电脑在鼠标右键后会执行mouseup事件
        //     if (e.button === 0) {
        //       menu.style.display = "none";
        //     }
        //   },
        //   false
        // );
        console.log(this.$refs.contexmenu_excel.style.display);
      },
      deep: true,
    },
  },
  methods: {
    addRowCol(type) {
      this.$emit("addRowCol", type);
      var menu = this.$refs.contexmenu_excel;
      menu.style.display = "none";
    },
    closeRightPanel(){
      var menu = this.$refs.contexmenu_excel;
      menu.style.display = "none";
    }
  },
};
</script>
<style scoped>
.col-width-panel,
.row-height-panel,
.chosen-area-p,
.rightmouse-panel-div,
.chosen-area-p div {
  position: absolute;
}

.col-width-panel div {
  width: 8px;
  position: absolute;
  cursor: col-resize;
  z-index: 999;
}

.row-height-panel div {
  height: 8px;
  position: absolute;
  cursor: row-resize;
  z-index: 999;
}

.drug-ele-td {
  background-color: #f0f0f0 !important;
  cursor: pointer;
}

.rightmouse-panel-div {
  text-align: left;
  background-color: #ffffff;
  border: 1px solid #bbd8e5;
  border-radius: 4px;
  z-index: 9;
  -moz-user-select: none; /*火狐*/
  -webkit-user-select: none; /*webkit浏览器*/
  -ms-user-select: none; /*IE10*/
  -khtml-user-select: none; /*早期浏览器*/
  user-select: none;
  position: fixed;
  width: 120px;
  display: none;
}

.rightmouse-panel-div .wb {
  line-height: 24px;
  letter-spacing: 1px;
  font-size: 13px;
  padding-left: 7px;
  cursor: pointer;
}

.rightmouse-panel-div .wb:hover {
  background-color: #f0f8ff;
}

.panel-div-left,
.panel-div-right {
  float: left;
}

.panel-div-left {
  border-right: 1px solid #bbd8e5;
}

.excel-rightmomuse-icon-css {
  display: inline-block;
  width: 20px;
}

.excel-rightmomuse-icon-next-css {
  margin-left: 33px;
  font-size: 18px;
  color: #795548;
}

.setting .setting-text {
  color: #e91e63;
}

.setting .setting-input {
  margin-left: 4px;
}

.setting .setting-item {
  margin-right: 7px;
}

.setting input {
  width: 25px;
}
</style>
