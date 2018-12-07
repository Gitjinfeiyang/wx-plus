export const reachBottomBehavior=Behavior({
    data:{
        offsetHeight:0,
        lastScrollTop:0,
    },
    ready(){
      this.initScrollData()
    },
    methods:{
        getScrollAreaHeight(){
          console.warn("[reachBottomBehavior]:Method <getScrollAreaHeight> must be overide and return a Promise!")
          return Promise.resolve(false)
        },
        initScrollData(){
          this.getScrollAreaHeight()
            .then((res) => {
              let offsetHeight =res;
              if ((!offsetHeight) || typeof offsetHeight != 'number') {

              } else {
                this.setData({
                  offsetHeight,
                  lastScrollTop:offsetHeight-50
                })
              }
            })
          
        },
        bindScroll({detail:{scrollHeight,scrollTop},currentTarget:{dataset:{index}}}){
          let targetScrollTop = scrollHeight - this.data.offsetHeight -30
            if(scrollTop >= targetScrollTop && scrollTop > this.data.lastScrollTop+50){
              //如果比目标大很多，说明高度已经变化
              if(scrollTop > targetScrollTop + 100){
                this.initScrollData()
              }
              this.setData({
                lastScrollTop:scrollTop
              })
              this.triggerEvent("reachbottom",{index})
            }else if(scrollTop < this.data.lastScrollTop - 50){
                this.initScrollData()

                this.setData({
                  lastScrollTop: targetScrollTop-50              
                })
            }
        },
    }
})