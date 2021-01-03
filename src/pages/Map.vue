<template>
  <div id="root">
    <svg x=0 y=0 width=1024 height=768 style="background-color: #f0f0f0">
    </svg>
  </div>
</template>

<script>
import Vue from 'vue'
import Node from "../components/Node.vue"
import * as UUID from 'uuid'
import {Line} from "../models/model"

const ctx = require('../main');

export default {
  name: "Map",
  components: {
    Node
  },
  data() {
    return {
      scale: 1.0,
      objects: [],
      nodeMap: {},
      lineMap: {},
      nextId: 10
    }
  },
  methods: {
    updateLines() {
      for (const [key, value] of Object.entries(this.lineMap)) {
        this.updateLine(value)
      }
    },
    addNode(value) {
      const x = value.pos.x;
      const y = value.pos.y;
      const ComponentClass = Vue.extend(Node);
      const instance = new ComponentClass();
      instance.$mount();
      console.log(instance.$el)
      $('#root').append(instance.$el);
      $(instance.$el).css({position: 'absolute', left: x, top: y})
      $(instance.$el).attr("id", value.id)

      // ノードのイベント受け取る
      instance.$on('onMove', this.updateLines)
      instance.$on('onMoveStop', this.onUpdateNode)
      instance.$on('onDrop', this.onDrop)
      instance.$on('onUpdateNode', this.onUpdateNode)

      instance.nodeText = value.text || 'node-text';

      this.nodeMap[value.id] = instance;

      this.updateLines()
    },
    addLine(value) {
      console.log("addline")
      const svg = $('svg')
      var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("stroke", "#333333")
      line.setAttribute("stroke-width", "2")
      svg.append(line)
      $(line).attr("id", value.id)

      this.updateLine(value)

      this.lineMap[value.id] = value;
    },
    updateLine(line) {
      const from = this.nodeMap[line.from];
      if (!from) {
        return;
      }
      const to = this.nodeMap[line.to];
      if (!to) {
        return;
      }

      const from_pos = from.centerPos()
      const to_pos = to.centerPos()

      const a = $(`#${line.id}`)[0]
      a.setAttribute("x1", from_pos.left)
      a.setAttribute("y1", from_pos.top)
      a.setAttribute("x2", to_pos.left)
      a.setAttribute("y2", to_pos.top)
    },
    removeLine(line) {
      console.log('removeLine', line)
      this.entities().doc(line.id).delete()
    },
    entities() {
      return ctx.db.collection('maps')
          .doc('y8pzFwJTTbHjGFVEqAmB')
          .collection('entities');
    },
    onUpdateNode(node) {
      const docId = node.$el.getAttribute('id')
      this.entities().doc(docId).update({
        text: node.nodeText,
        pos: {
          x: $(node.$el).css('left'),
          y: $(node.$el).css('top')
        }
      })
      this.updateLines()
    },
    onDrop(src, target) {
      console.log(src, target)

      const value = {
        type: 'line',
        from: src.getAttribute('id'),
        to: target.getAttribute('id')
      }

      const line = new Line(value)

      const exLine = Object.entries(this.lineMap).find(ent => {
        const [key, value] = ent;
        const l = new Line(value)
        return l.keyId() == line.keyId()
      })
      if (exLine) {
        // もうある
        this.removeLine(exLine[1]);
        return;
      }

      this.entities().add(value)

      // this.addLine(value)
    }
  },
  // mounted element が使えるようになった時に呼ばれる
  // mounted は 全ての子コンポーネントもマウントされていることを保証しないことに注意してください。
  // ビュー全体がレンダリングされるまで待つ場合は、 mounted の代わりに vm.$nextTick を使うことができます。
  mounted: function () {
    $('#root').on('dblclick', e => {
      console.log('root-dblclk')
      this.entities().add(
          {
            type: 'node',
            pos: {
              x: e.offsetX,
              y: e.offsetY
            }
          })
    });

    this.objects.forEach(value => {
      switch (value.type) {
        case "node":
          this.addNode(value)
          break;
      }
    })
    this.objects.forEach(value => {
      switch (value.type) {
        case "line":
          this.addLine(value)
          break;
      }
    })

    // 対象の map の更新を listen する
    // mapId:y8pzFwJTTbHjGFVEqAmB 固定
    this.entities().onSnapshot((querySnapshot) => {
      console.log('onSnapshot', querySnapshot)
      querySnapshot.docChanges().forEach((change) => {
        console.log(change)
        if (change.type === "added") {
          console.log("New city: ", change.doc.data());
          if (change.doc.data().type == 'node') {
            this.addNode({id: change.doc.id, ...change.doc.data()})
          } else {
            this.addLine({id: change.doc.id, ...change.doc.data()})
          }
        }
        if (change.type === "modified") {
          console.log("Modified city: ", change.doc.data());
        }
        if (change.type === "removed") {
          console.log("Removed city: ", change.doc.data());
          console.log($(`#${change.doc.id}`))
          delete this.lineMap[change.doc.id]
          $($(`#${change.doc.id}`)).remove()
        }
      });
    });
  }
}
</script>

<style scoped>

svg {
  filter: drop-shadow(10px 10px 5px rgb(0, 0, 0));
}
</style>