<template>
  <div class="v-excel" @contextmenu.prevent="showContexMenu($event)">
    <mouse-right-panel :axis="axis" @addRowCol="addRowCol($event)"></mouse-right-panel>
    <div class="ve-bars" v-if="showToolBar">
      <excel-toolbar :formats="formats" :fonts="fonts" :formulas="formulas" :attrs="cellAttrs" :history="historyValues"
        :reHistory="popHistoryValues" @change="changeToolbarHandler" @change-paint="changePaintHandler"
        @change-merge="changeMergeHandler" @undo="undoHandler" @redo="redoHandler" @addrow="addrowHandler" ref="toolbar"
        v-if="cellAttrs"></excel-toolbar>
      <excel-editor-bar :cell="editorBar.cell" v-model="editorBar.value" v-if="editorBar">
      </excel-editor-bar>
    </div>
    <div class="ve-header">
      <table class="base-table" :width="tablewidth+'px'">
        <colgroup>
          <col width="60" v-show="showRowHeader" />
          <col v-for="(col, index) in value.cols" :width="col.width" :key="col.index" :ref="`col_${index}`" />
        </colgroup>
        <thead>
          <template v-if="showColHeader">
            <tr>
              <th style="
                  font-size: 12px;
                  background: #f4f5f8;
                  font-weight: normal;
                  color: #666;
                " v-if="showRowHeader">
                &nbsp;
              </th>
              <th v-for="(col, index) in value.cols" :key="col.index" :ref="`col_h${index}`" style="
                  font-size: 12px;
                  background: #f4f5f8;
                  font-weight: normal;
                  color: #666;
                " @mouseover="rowColMouseOverHandler('col', index, $event)">
                {{ createColHeader(col.index) }}
              </th>
            </tr>
          </template>
          <template v-else>
            <tr style="boder: none">
              <th v-for="(col, index) in value.cols" :key="col.index" :ref="`col_h${index}`"
                style="border-bootom: 1px solid #cfcfcf; border-top: none"
                @mouseover="rowColMouseOverHandler('col', index, $event)"></th>
            </tr>
          </template>
        </thead>
      </table>
      <excel-resizer vertical :target="colResizer.target" :index="colResizer.index" @change="colChangeResizerHandler"
        v-if="colResizer && colResizer.target">
      </excel-resizer>
    </div>
    <div class="ve-body" ref="body">
      <table :width="tablewidth+'px'" class="base-table">
        <colgroup>
          <template v-if="showRowHeader">
            <col width="60" />
          </template>

          <col width="0.1" v-else />
          <col v-for="(col, index) in value.cols" :width="col.width" :key="col.index" :ref="`col_${index}`" />
        </colgroup>
        <tbody>
          <tr v-for="(row, rindex) in value.rows" :key="rindex">
            <td :ref="`row_${rindex}`" :height="row.height" style="
                font-size: 12px;
                background: #f4f5f8;
                font-weight: normal;
                color: #666;
              " @mouseover="rowColMouseOverHandler('row', rindex, $event)">
              {{ rindex + 1 }}
            </td>

            <td :height="row.height" v-for="(col, cindex) in value.cols" :key="col.index"
              :ref="`cell_${rindex}_${cindex}`" :rowspan="
                (value[rindex] &&
                  value[rindex][cindex] &&
                  value[rindex][cindex].rowspan) ||
                1
              " :colspan="
                (value[rindex] &&
                  value[rindex][cindex] &&
                  value[rindex][cindex].colspan) ||
                1
              " :style="
                value[rindex] &&
                value[rindex][cindex] &&
                cellStyle(value[rindex][cindex])
              " :row-index="rindex" :col-index="cindex" type="cell"
              @dblclick.left.stop="cellDblclickHandler(rindex, cindex, $event)"
              @mousedown.left="cellMousedownHandler(rindex, cindex, $event)">
              {{
                value[rindex] &&
                value[rindex][cindex] &&
                renderCell(value[rindex][cindex])
              }}
            </td>
          </tr>
        </tbody>
      </table>
      <excel-border ref="eborder" @change="changeBorderHandler" @copy="copyBorderHandler" :tableIndex="tableIndex">
      </excel-border>
      <excel-paint-border :target="pborderTarget" />
      <excel-editor :target="editor.target" :formulas="formulas" v-model="editor.value" v-if="editor && editor.target"
        ref="editor">
      </excel-editor>
      <excel-resizer :target="rowResizer.target" :index="rowResizer.index" @change="rowChangeResizerHandler"
        v-if="rowResizer && rowResizer.target">
      </excel-resizer>
    </div>
  </div>
</template>
<script>
  import {
    bind
  } from "./event.js";
  import ExcelBorder from "./ExcelBorder";
  import ExcelPaintBorder from "./ExcelPaintBorder";
  import ExcelEditor from "./ExcelEditor";
  import ExcelResizer from "./ExcelResizer";
  import ExcelEditorBar from "./ExcelEditorBar";
  import ExcelToolbar from "./ExcelToolbar";
  import MouseRightPanel from "./MouseRightPanel";
  import {
    defaultCols,
    formats,
    fonts,
    formulas,
    formulaFilterKey,
    defaultCellAttrs,
    cellStyle,
    getStyleAttrs,
    formatRenderHtml,
  } from "./settings.js";

  export default {
    name: "v-excel",
    components: {
      ExcelBorder,
      ExcelPaintBorder,
      ExcelEditor,
      ExcelResizer,
      ExcelEditorBar,
      ExcelToolbar,
      MouseRightPanel,
    },
    props: {
      showToolBar: {
        type: Boolean,
        default: true,
        required: false
      },
      showColHeader: {
        type: Boolean,
        default: true,
        required: false
      },
      showRowHeader: {
        type: Boolean,
        default: true,
        required: false
      },
      formats: {
        type: Array,
        default: () => formats
      },
      fonts: {
        type: Array,
        default: () => fonts
      },
      formulas: {
        type: Array,
        default: () => formulas
      },
      value: {
        type: Object,
        default: () => {
          return {};
        },
      }, // [[{text: '', type: '', style: ''}]..]
      tableIndex: {
        type: Number,
        default: 0,
        required: false
      },
    },
    data() {
      const {
        value
      } = this;
      const defaultColWidth = 100;
      if (value.cols === undefined) {
        value.cols = defaultCols.map((col, index) => {
          return {
            width: defaultColWidth,
            index: col
          };
        });
      }
      if (value.rows === undefined) {
        const max = ((Object.keys(value).length - 1) / defaultColWidth + 1) * 100;
        value.rows = [];
        for (let i = 0; i < max; i++) {
          value.rows[i] = {
            height: 40
          };
        }
      }
      return {
        axis: {
          x: null,
          y: null
        },
        editor: {},
        editorBar: {},
        pborderTarget: null,
        rowResizer: null,
        colResizer: null,
        cellAttrs: Object.assign({}, defaultCellAttrs),
        selectedBox: null,
        copyPasteCells: null, // copy, paste cells
        isClearCopyCells: false,
        current: null,
        historyValues: [],
        popHistoryValues: [],
      };
    },
    mounted() {
      //bind("keydown", this.copyPasteHandler);
    },
    methods: {
      renderCell(cell) {
        const colMap = {};
        this.value.cols.forEach((col, i) => {
          colMap[col.index] = i;
        });
        const txt = formulaFilterKey(cell.text, (fx, params) => {
          let paramValues = [];
          try {
            if (params.indexOf(":") !== -1) {
              const [min, max] = params.split(":");
              const idx = /\d+/.exec(min).index;
              const maxIdx = /\d+/.exec(max).index;
              let minC = min.substring(0, idx);
              let minR = parseInt(min.substring(idx));

              let maxC = max.substring(0, maxIdx);
              let maxR = parseInt(max.substring(maxIdx));
              // console.log(min, max, minR, maxR, minC, maxC)
              if (maxC === minC) {
                for (let i = minR; i <= maxR; i++) {
                  paramValues.push(
                    Number(this.getDataRowCol(i - 1, colMap[minC]).text)
                  );
                }
              } else {
                for (let i = colMap[minC]; i <= colMap[maxC]; i++) {
                  paramValues.push(Number(this.getDataRowCol(minR - 1, i).text));
                }
              }
            } else if (params.indexOf(",") !== -1) {
              paramValues = params.split(",").map((p) => {
                const idx = /\d+/.exec(p).index;
                const c = p.substring(0, idx);
                const r = p.substring(idx);
                return Number(this.getDataRowCol(r - 1, colMap[c]).text);
              });
            }
          } catch (e) {
            // console.log('warning:', e)
          }
          // console.log('values:', paramValues)
          return fx.fn(paramValues);
        });
        return formatRenderHtml(cell.format, txt);
      },
      rowColMouseOverHandler(type, index, evt) {
        // mouse key left pressed
        // console.log('>>>>>>>>over')
        console.log(evt);
        console.log(type);
        console.log(index);

        if (evt.buttons !== 1) {
          this[`${type}Resizer`] = {
            target: evt.target,
            index
          };
        }
      },
      colChangeResizerHandler(index, distance) {
        const {
          value
        } = this;
        const w = value.cols[index].width + distance;
        if (w <= 50) return;
        this.addHistoryValues();
        value.cols[index].width = w;
        this.$refs[`col_${index}`].forEach((c) => {
          c.width = w;
        });
        this.borderReload();
        this.$refs.editor && this.$refs.editor.reload();
      },
      rowChangeResizerHandler(index, distance) {
        const {
          value
        } = this;
        const h = value.rows[index].height + distance;
        if (h <= 22) return;
        this.addHistoryValues();
        value.rows[index].height = h;
        this.$refs[`row_${index}`].forEach((c) => {
          c.height = h;
        });
        this.borderReload();
        this.$refs.editor && this.$refs.editor.reload();
      },
      cellDblclickHandler(row, col, evt) {
        // console.log(JSON.stringify(this.value));
        // console.log(this.getEditValue(row, col));
        // console.log(this.current.col.canedit);
        if (
          this.getEditValue(row, col).canedit == undefined ||
          this.getEditValue(row, col).canedit
        ) {
          this.editor = {
            target: evt.target,
            value: this.getEditValue(row, col),
          };
          //  console.log("ss");
        } else {
          //console.log("ddd");
          // console.log(this.getEditValue(row, col).canedit);
        }
      },
      cellMousedownHandler(row, col, evt) {
        // console.log(this.editor)
       // this.$refs.eborder.copyHandler(evt);
        this.$refs.eborder.mousedownHandler(evt);

        if (this.editor !== null && this.editor.target) {
          // this.addHistoryValues()
          this.editor = null;
        }
        if (!evt.shiftKey) {
          this.editorBar = {
            cell: `${this.value.cols[col].index}${row + 1}`,
            value: this.getEditValue(row, col),
          };
        }

        // paint
        if (this.selectedBox === null) {
          this.setCellAttrs(row, col);
        }
        // set current data cell
        this.current = {
          row,
          col,
          cell: this.getDataRowCol(row, col)
        };
        this.$emit('cellMousedownHandler', row, col, evt)
      },
      undoHandler() {
        if (this.historyValues.length > 0) {
          const v = this.historyValues.pop();
          this.popHistoryValues.push(v);
          console.log("history: ", v);
          this.resetValue(v);
          this.setCellAttrs(this.current.row, this.current.col);
        }
      },
      redoHandler() {
        if (this.popHistoryValues.length > 0) {
          const v = this.popHistoryValues.pop();
          this.historyValues.push(v);
          this.resetValue(v);
          this.setCellAttrs(this.current.row, this.current.col);
        }
      },
      copyPasteHandler(evt) {
        // console.log('::::::::>>>', evt)
        console.log(this.$refs)
        if (evt.ctrlKey) {
          // ctrl + c
          if (evt.keyCode === 67) {
            console.log(">>>", this.$refs.eborder);
            this.copyPasteCells = this.$refs.eborder.getActivies();
            evt.returnValue = false;
          }
          // ctrl + x
          if (evt.keyCode === 88) {
            this.isClearCopyCells = true;
            this.copyPasteCells = this.$refs.eborder.getActivies();
            evt.returnValue = false;
          }

          // ctrl + v
          if (evt.keyCode === 86) {
            // console.log('ctrlV')
            if (this.copyPasteCells !== null) {
              const {
                rows,
                cols
              } = this.copyPasteCells;
              // console.log('rows: ', rows, ', cols: ', cols)
              const c = this.$refs.eborder.getActivies();
              // console.log(rows, cols, '>>>>>>')
              this.addHistoryValues();
              rows.forEach((row, rindex) => {
                cols.forEach((col, cindex) => {
                  this.copyStyleAttrs(
                    row,
                    col,
                    c.rows[0] + rindex,
                    c.cols[0] + cindex,
                    true
                  );
                  if (this.isClearCopyCells) {
                    this.setDataRowCol(row, col, {
                      text: ""
                    });
                    this.copyPasteCells = null;
                  }
                });
              });
              this.borderReload();
              this.isClearCopyCells = false;
            }
          }
        }
      },
      changeBorderHandler(rows, cols) {
        // console.log('border.change....')
        // if paint format
        if (this.selectedBox !== null) {
          const {
            rows,
            cols
          } = this.selectedBox;
          this.addHistoryValues();
          this.$refs.eborder.cellForEach((row, rowIndex, col, colIndex) => {
            // let cell = this.getDataRowCol(row, col)
            const copyRow = rows[rowIndex % rows.length];
            const copyCol = cols[colIndex % cols.length];
            this.copyStyleAttrs(copyRow, copyCol, row, col);
          });
          this.$refs.toolbar.clearPaintFormatActive();
          this.selectedBox = null;
        }
      },
      copyBorderHandler(evt, position, x, y, x1, y1) {
        // console.log('>>>', evt, x, y, x1, y1)
        const {
          rows,
          cols
        } = this.$refs.eborder.getActivies();
        const colMap = {};
        this.value.cols.forEach((col, i) => {
          colMap[col.index] = i;
        });
        this.addHistoryValues();
        for (let i = x; i <= x1; i++) {
          for (let j = y; j <= y1; j++) {
            const copyRow = rows[(i - x) % rows.length];
            const copyCol = cols[(j - y) % cols.length];
            // console.log(copyRow, copyCol, i, j, evt.ctrlKey)
            this.copyStyleAttrs(copyRow, copyCol, i, j, true, (cell) => {
              // int handler
              if (evt.ctrlKey) {
                let txt = cell.text;
                // console.log('::::::::', txt, position)
                if (/^\d*$/.test(txt)) {
                  let tint = parseInt(txt);
                  if (position === "top" || position === "left") {
                    tint -= copyRow - i + (copyCol - j);
                  } else {
                    tint += i - copyRow + (j - copyCol);
                  }
                  cell.text = tint;
                }
              }
              // formalus handler
              if (!/^\s*$/.test(cell.text)) {
                const replaceFormula = (_v) => {
                  const idx = /\d+/.exec(_v).index;
                  let vc = _v.substring(0, idx);
                  let vr = parseInt(_v.substring(idx));
                  if (position === "top") {
                    vr -= copyRow - i + (copyCol - j);
                  } else if (position === "left") {
                    vc =
                      this.value.cols[colMap[vc] - (copyRow - i + (copyCol - j))]
                      .index;
                  } else if (position === "bottom") {
                    vr += j - copyCol + (i - copyRow);
                  } else if (position === "right") {
                    vc =
                      this.value.cols[colMap[vc] + (j - copyCol + (i - copyRow))]
                      .index;
                  }
                  return `${vc}${vr}`;
                };
                formulaFilterKey(cell.text, (fx, params) => {
                  if (params.indexOf(":") !== -1) {
                    params = params.split(":").map(replaceFormula).join(":");
                  } else {
                    params = params.split(",").map(replaceFormula).join(",");
                  }
                  cell.text = `=${fx.key}(${params})`;
                });
              }
              return cell;
            });
          }
        }
      },
      changePaintHandler(isCopy) {
        if (isCopy) {
          this.selectedBox = this.$refs.eborder.getActivies();
        } else {
          this.selectedBox = null;
        }
      },
      changeMergeHandler() {
        // merge cell
        let {
          current
        } = this;
        console.log("merge...", current);
        // 如果当前的单元格为合并单元格
        if (current.cell.rowspan > 1 || current.cell.colspan > 1) {
          this.addHistoryValues();
          // 取消合并
          //alert(current.cell.rowspan)
         // alert(current.cell.colspan)
          for (let i = 0; i < current.cell.rowspan; i++) {
            for (let j = 0; j < current.cell.colspan; j++) {
              if (i === 0 && j === 0) continue;

              this.setDataRowCol(current.row + i, current.col + j, {
                text: "",
                invisable: false
              });
            }
          }
          this.$set(current.cell, "rowspan", defaultCellAttrs.rowspan);
          this.$set(current.cell, "colspan", defaultCellAttrs.colspan);
          this.setCellAttrs(current.row, current.col);
        } else {
          // 合并
          let {
            rows,
            cols
          } = this.$refs.eborder.getActivies();
          if (rows.length > 1 || cols.length > 1) {
            this.addHistoryValues();
            const cell = this.getDataRowCol(rows[0], cols[0]);
            this.current = {
              row: rows[0],
              col: cols[0],
              cell
            };
            this.$set(cell, "rowspan", rows.length);
            this.$set(cell, "colspan", cols.length);
            for (let i = 0; i < rows.length; i++) {
              for (let j = 0; j < cols.length; j++) {
                if (i === 0 && j === 0) continue;
                this.setDataRowCol(rows[i], cols[j], {
                  text: "",
                  invisable: true,
                  merge: [rows[0], cols[0]],
                });
              }
            }
            this.setCellAttrs(rows[0], cols[0]);
          }
        }
        // console.log(this.value)
      },
      changeToolbarHandler(attrs) {
        // console.log('attr: ', attrs)
        this.addHistoryValues();
        this.$refs.eborder.cellForEach((row, rowIndex, col, colIndex) => {
          const cell = this.getDataRowCol(row, col);
          if (!cell.invisable) {
            this.setDataRowCol(
              row,
              col,
              Object.assign({}, cell, attrs),
              false,
              false
            );
          }
          this.borderReload();
        });
      },
      borderReload() {
        setTimeout(() => {
          this.$refs.eborder.reload();
        }, 0);
      },
      getEditValue(row, col) {
        return this.getDataRowCol(row, col);
      },
      copyStyleAttrs(
        fromRow,
        fromCol,
        toRow,
        toCol,
        copyText = false,
        filter = (cell) => cell
      ) {
        let {
          merge,
          ...fromCell
        } = this.getDataRowCol(fromRow, fromCol);
        // console.log('merge::', merge)
        if (merge) {
          merge = [merge[0] + (toRow - fromRow), merge[1] + (toCol - fromCol)];
        }
        // console.log('>>>merge::', merge)
        this.setDataRowCol(
          toRow,
          toCol,
          filter({
            merge,
            ...fromCell
          }),
          copyText
        );
      },
      setCellAttrs(row, col) {
        const cell = this.getDataRowCol(row, col);
        Object.keys(defaultCellAttrs).forEach((attr) => {
          this.cellAttrs[attr] = cell[attr] || defaultCellAttrs[attr];
        });
      },
      getDataRow(row) {
        if (!this.value[row]) {
          this.$set(this.value, row, {});
        }
        return this.value[row];
      },
      resetValue(v) {
        Object.keys(v).forEach((k) => {
          if (/^\d+$/.test(k)) {
            // this.value.$set(k, v[k])
            // console.log(k, v[k])
            Object.keys(v[k]).forEach((k1) => {
              this.setDataRowCol(k, k1, v[k][k1]);
            });
          }
          // this.$set(this.value, k, v[k])
        });
      },
      setDataRowCol(row, col, v, copyText = true, copyspan = true) {
        // console.log('history: ', this.historyValues)
        let r = this.getDataRow(row);
        const cell = r[col];
        console.log(":::::>", row, col, cell);
        if (!copyText && cell) {
          v.text = cell.text;
        }
        if (!copyspan && cell && cell.rowspan) {
          v.rowspan = cell.rowspan;
        }
        if (!copyspan && cell && cell.colspan) {
          v.colspan = cell.colspan;
        }
        this.$set(r, col, v);
        if (this.editor !== null) {
          this.editor.value = v;
        }
        return r;
      },
      getDataRowColStyle(row, col) {
        return getStyleAttrs(this.getDataRowCol(row, col));
      },
      getDataRowCol(row, col) {
        if (!this.value[row]) {
          this.$set(this.value, row, {});
        }
        if (!this.value[row][col]) {
          this.$set(this.value[row], col, {
            text: ""
          });
        }
        return this.value[row][col];
      },
      addHistoryValues() {
        this.historyValues.push(JSON.parse(JSON.stringify(this.value)));
      },
      changeHandler() {
        this.$emit("change", this.value);
      },
      addrowHandler() {
        console.log(this.current.row);
        this.value.rows.splice(this.current.row + 1, 0, {
          height: 40
        });
      },
      createColHeader(n) {
        const ordA = "A".charCodeAt(0);
        const ordZ = "Z".charCodeAt(0);
        const len = ordZ - ordA + 1;
        let str = "";
        while (n >= 0) {
          str = String.fromCharCode((n % len) + ordA) + str;
          n = Math.floor(n / len) - 1;
        }
        return str;
      },
      addRowCol(type) {
        console.log(this.current);
        console.log('type');
        console.log(type);
        console.log(this.current.row);
        console.log(this.current.col);
        let _this = this;
        let originalValueStr = JSON.stringify(_this.value)
        let originalValue = JSON.parse(originalValueStr)
        if (this.current && this.current.row >= 0) {
          let row = this.current.row;
          let col = this.current.col;
          // var chosen = chosenColl.first();
          console.log(type);
          console.log(type);
          if (type == "addbefore") {
            this.value.rows.splice(row, 0, {
              height: 40
            });
            _this.editValuePos(row, "row", "edit",originalValue);
          } else if (type == "addafter") {
            this.value.rows.splice(row + 1, 0, {
              height: 40
            });
            _this.editValuePos(row + 1, "row", "edit",originalValue);
          } else if (type == "addleft") {
            this.value.cols.splice(col, 0, {
              width: 200,
              index: col
            });
            _this.editColIndex();
            _this.editValuePos(col, "col", "edit",originalValue);
          } else if (type == "addright") {
            this.value.cols.splice(col + 1, 0, {
              width: 200,
              index: col + 1
            });

            _this.editColIndex();
            _this.editValuePos(col + 1, "col", "edit",originalValue);
            //addRowColSpan(col, type);
          } else if (type == "delrow") {
            if(_this.value.rows.length>1){


            this.value.rows.splice(row, 1);
            _this.editValuePos(row, "row", "del",originalValue);
            }
          } else if (type == "delcol") {
            // console.log('delcol')
            // console.log(col)
           // console.log(this.value.cols)
           if(_this.value.cols.length>1){
            this.value.cols.splice(col, 1);
          //  console.log(this.value.cols)
          //  console.log(col)

            _this.editValuePos(col, "col", "del",originalValue);
            }
            // addRowColSpan(col, type);
          }
          // this.editorBar = false;
          // this.current = null;
        }
      },
      addRowColSpan(list, ty) {
        var coll = [];
        if (ty == 0 || ty == 1 || ty == 4) {
          var tr = list;
          tr.find("td").each(function() {
            if ($(this).is(":hidden")) {
              var p = getFatherCell($(this));
              var con = true;
              for (var i = 0; i < coll.length; i++) {
                if (coll[i].is(p)) {
                  con = false;
                  break;
                }
              }
              if (con && p != null) {
                coll[coll.length] = p;
                p.attr("rowspan", spanNum(p.attr("rowspan"), ty == 4 ? -1 : 1));
              }
            } else {
              if ($(this).attr("rowspan") && $(this).attr("colspan")) {
                coll[coll.length] = $(this);
                if (ty == 4) {
                  var nextTr = tr.next("tr");
                  if (nextTr.length == 1 && Number($(this).attr("rowspan")) > 1) {
                    var ind = tr.find("td").index($(this));
                    nextTr
                      .find("td:eq(" + ind + ")")
                      .attr("rowspan", spanNum($(this).attr("rowspan"), -1))
                      .attr("colspan", $(this).attr("colspan"))
                      .css("display", "");
                  }
                } else {
                  $(this).attr("rowspan", Number($(this).attr("rowspan")) + 1);
                }
              }
            }
          });
          var clone = tr.clone(true);
          if (ty == 0) {
            clone.find("td[rowspan][colspan]").each(function() {
              $(this)
                .removeAttr("rowspan")
                .removeAttr("colspan")
                .css("display", "none");
            });
            //移除问题的样式
            clone.find("td").each(function() {
              $(this).removeAttr("table-question-id").css("border-bottom", "");
            });
          }
          if (ty == 1) {
            clone.find("td[rowspan][colspan]").each(function() {
              $(this)
                .removeAttr("rowspan")
                .removeAttr("colspan")
                .css("display", "none");
            });
            //移除问题的样式
            clone.find("td").each(function() {
              $(this).removeAttr("table-question-id").css("border-bottom", "");
            });
          }
          clone.height(25);
          clone.find("td").removeClass("td-chosen-css").html("");
          return clone;
        } else {
          var cloneLs = [];
          list.each(function() {
            if ($(this).is(":hidden")) {
              var p = getFatherCell($(this));
              var con = true;
              for (var i = 0; i < coll.length; i++) {
                if (coll[i].is(p)) {
                  con = false;
                  break;
                }
              }
              if (con && p != null) {
                coll[coll.length] = p;
                p.attr("colspan", spanNum(p.attr("colspan"), ty == 5 ? -1 : 1));
              }
            } else {
              if ($(this).attr("rowspan") && $(this).attr("colspan")) {
                coll[coll.length] = $(this);
                if (ty == 5) {
                  var nextTd = $(this).next("td");
                  if (nextTd.length == 1 && Number($(this).attr("colspan")) > 1) {
                    nextTd
                      .width($(this).width())
                      .attr("rowspan", $(this).attr("rowspan"))
                      .attr("colspan", spanNum($(this).attr("colspan"), -1))
                      .css("display", "");
                  }
                } else {
                  $(this).attr("colspan", Number($(this).attr("colspan")) + 1);
                }
              }
            }
            var clone = $(this).clone(true);
            clone.width($(this).width());
            clone.removeClass("td-chosen-css").html("");
            cloneLs[cloneLs.length] = clone;
          });
          for (var i = 0; i < cloneLs.length; i++) {
            if (ty == 2) {
              cloneLs[i].insertBefore($(list.get(i)));
              //移除问题的样式
              cloneLs[i].removeAttr("table-question-id").css("border-bottom", "");
              var t = $(list.get(i));
              if (t.attr("rowspan") && t.attr("colspan")) {
                t.removeAttr("rowspan")
                  .removeAttr("colspan")
                  .css("display", "none");
              }
              //console.log(t);
            }
            if (ty == 3) {
              cloneLs[i].insertAfter($(list.get(i)));
              var t = cloneLs[i];
              if (t.attr("rowspan") && t.attr("colspan")) {
                t.removeAttr("rowspan")
                  .removeAttr("colspan")
                  .css("display", "none");
              }
              //移除问题的样式
              t.removeAttr("table-question-id").css("border-bottom", "");
            }
          }
        }
      },
      showContexMenu(event) {
        //console.log("dddddddddddddddddd");
        console.log(event);
        event.preventDefault();
        var x = event.clientX;
        var y = event.clientY;
        this.axis.x = x;
        this.axis.y = y;
        console.log(this.axis);
      },
      editValuePos(posIndex, type, controlType,t) {
        let _this = this;

        let tempStr = JSON.stringify(t);
        let tempObj = JSON.parse(tempStr); // { ...this.value };
        console.log('tempObj')
        console.log(tempObj);
        if (type == "row") {

          _this.editRow(posIndex, controlType, tempObj);
        }

        if (type == "col") {
          _this.editCol(posIndex, controlType, tempObj);
        }
      },
      editColIndex() {
        let tempCols = [...this.value.cols];
        let _this = this;
        tempCols.forEach(function(item, index) {
          item.index = index;
          _this.value.cols.splice(index, 1, item);
        });
      },
      editRow(posIndex, controlType, tempObj) {
        let _this = this;
        let posMark = 0; //调整位置判断参数
        let minusPos = -1; //调整元素的位置
        if (controlType !== "edit") {
          posMark = 1;
          minusPos = 1;
        }
        console.log('posIndex')
        console.log(posIndex)
        console.log(controlType)
        console.log(tempObj)
        for (let r = 0; r <= tempObj.rows.length; r++) {
          _this.value[r] = undefined;
          if (r + posMark > posIndex) {
            if (tempObj[r + minusPos]) {
              _this.value[r] = tempObj[r + minusPos];
            }
          } else {
            if (r != posIndex) {
              if (tempObj[r]) {
                _this.value[r] = tempObj[r];
              }
            }
          }
        }
      },
      editCol(posIndex, controlType, tempObj) {
        let _this = this;
        let posMark = 0; //调整位置判断参数
        let minusPos = -1; //调整元素的位置
        if (controlType !== "edit") {
          posMark = 1;
          minusPos = 1;
        }

        for (var r = 0; r < tempObj.rows.length; r++) {
          if (tempObj && tempObj[r]) {
            for (var c = 0; c <= tempObj.cols.length; c++) {
              if (_this.value[r][c]) {
                _this.value[r][c] = undefined;
              }
              console.log('inde equals')
              console.log(c+posMark)
              console.log(posIndex)
              if (c + posMark > posIndex) {
                if (tempObj[r][c + minusPos]) {
                  _this.value[r][c] = tempObj[r][c + minusPos];
                }
              } else {
                if (c != posIndex) {
                  if (tempObj[r][c]) {
                    _this.value[r][c] = tempObj[r][c];
                  }else{
                    console.log('eques')
                  }
                }
              }
            }
          }
        }
      },
      cellStyle,
      formatRenderHtml,
    },
    computed: {
      tablewidth: function() {
        let totalWidth = 0;
        for(let i=0;i<this.value.cols.length;i++){
          let item = this.value.cols[i]
              if(item.toString().indexOf('px')>-1)
              {
                item.width = parseInt(item.width.replace('px',''))
              }else{
                item.width = parseInt(item.width)
              }
             totalWidth= totalWidth + item.width
        }
        return totalWidth;
      },
    },
  };
</script>
