<template>
  <div class="node">
    <p class="node-text" contenteditable="true">{{ nodeText }}</p>
    <!--    <div class="node-form" style="display: none; position: absolute; top: 0px; left:0px">-->
    <!--      <textarea class="form-input" v-model="nodeText"></textarea>-->
    <!--    </div>-->
  </div>
</template>

<script>
export default {
  name: "Node",
  props: {
    title: String //追加
  },
  data() {
    return {
      nodeText: 'ノードアイテム'
    }
  },
  methods: {
    centerPos: function () {
      return {
        left: $(this.$el).position().left + $(this.$el).width() / 2,
        top: $(this.$el).position().top + $(this.$el).height() / 2
      }
    }
  },
  mounted() {
    $(this.$el).draggable({
          drag: (event, ui) => {
            this.$emit('onMove')
          },
          start: (event, ui) => {
            console.log("start")
          },
          stop: (event, ui) => {
            console.log("stop")
            this.$emit('onMoveStop', this)
          },
          stack: ".node",
          revert: "valid",
          revertDuration: 100
        }
    )

    $(this.$el).droppable({
          drop: (event, ui) => {
            console.log('dropped.', event, ui)
            this.$emit('onDrop', this.$el, ui.draggable[0])
          }
        }
    )

    $(this.$el).on('dblclick', (t, args) => {
      // $(t.currentTarget).find('.node-text').hide()
      // $(t.currentTarget).find('.node-form').show()
      // $(t.currentTarget).find('.node-text').attr('contenteditable', 'true')
      $(t.currentTarget).find('.node-text').focus()

      // $(t.currentTarget).find('.form-input').focus()
      t.stopPropagation();
    })

    $(this.$el).find('.node-text').on('blur', t => {
      this.nodeText = t.target.innerText
      this.$emit('onUpdateNode', this)
    })
  }
}
</script>

<style scoped>
.node {
  display: block;
  position: absolute;
  width: 10em;
  padding: 0.5em;
  background: #f9f9f9;
  color: #333333;
  border: 2px solid #333333;
  border-radius: 5px;

  box-shadow: 3px 3px 4px 0 rgba(0, 0, 0, .5);
}
</style>
