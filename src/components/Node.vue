<template>
  <div class="node">
    <div class="node-text">{{ nodeText }}</div>
    <div class="node-form" style="display: none;">
      <textarea class="form-input" v-model="nodeText"></textarea>
    </div>
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
      isActive: true,
      nodeText: 'ノードアイテム'
    }
  },
  methods: {
    centerPos: function() {
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
          stop: (event, ui) => {
            this.$emit('onMoveStop', this)
          },
          stack: ".node"
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
      $(t.currentTarget).find('.node-text').hide()
      $(t.currentTarget).find('.node-form').show()
      $(t.currentTarget).find('.form-input').focus()
      t.stopPropagation();
    })

    let node_form = $(this.$el).find('.node-form');
    node_form.on('submit', t => {
      $('.node').find('.node-text').show()
      $('.node').find('.node-form').hide()
    })
    node_form.find('textarea').on('blur', t => {
      $('.node').find('.node-text').show()
      $('.node').find('.node-form').hide()
      this.$emit('onUpdateNode', this)
    })
  }
}
</script>

<style scoped>
.node {
  display: block;
  position: absolute;
  left: 100px;
  top: 300px;
  width: 10em;
  /*height: 2em;*/

  background: #039be5;
  color: #ECEFF1;
  padding: 0.5em;
  border: 3px solid #aaaaaa;
  border-radius: 5px;
}
</style>
