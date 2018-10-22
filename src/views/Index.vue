<template>
  <main class="page-container">
    <div class="index-container">
      <!--header组件 接受参数 当前路由匹配的user-->
      <blog-index-header :user="user"></blog-index-header>
      <!--链接组件 接受参数:infoList-->
      <blog-index-links @openDialog="openDialog" :infoList="infoList"></blog-index-links>
      <!--文章列表部分 传递参数:文章列表-->
      <router-view :currentBlogList="currentBlogList"></router-view>
      <!--登陆弹窗部分 传递参数:openLoginDialog-->
      <login-dialog :openLoginDialog="openLoginDialog" @closeDialog="closeDialog"></login-dialog>
    </div>
    <!--canvas特效区域-->
    <canvas id="canvas" style="width:100%; height:100%"></canvas>
  </main>
</template>

<script type="text/ecmascript-6">
import BlogHeader from '../components/BlogHeader'
import BlogLinks from '../components/BlogLinks'
import LoginDialog from '../components/LoginDialog'
import {mapMutations, mapGetters, mapActions} from 'vuex'
export default{
  name: 'index',
  // 来源为router动态参数
  props: ['user'],
  components: {
    'blog-index-header': BlogHeader,
    'blog-index-links': BlogLinks,
    'login-dialog': LoginDialog
  },
  data () {
    return {
      infoList: {
        twitter: 'http://www.lanternpro.site/',
        github: 'https://github.com/',
        weibo: 'https://weibo.com/'
      }
    }
  },
  computed: {
    ...mapGetters([
      'openLoginDialog',
      'loginStatus',
      'users',
      'token',
      'userInfo',
      'currentBlogList',
      'lineColor'
    ])
  },
  watch: {
    // 如果路由有变化，会再次执行该方法
    '$route': function () {
      this.getInfo()
    }
  },
  created () {
    this.getInfo()
  },
  mounted () {
    let count = 70, distance = 80
    if (window.innerWidth < 600) {
      count = 30
      distance = 80
    }
    // 获取canvas上下文
    const canvasBody = document.getElementById('canvas'),
      drawArea = canvasBody.getContext('2d')
    const opts = {
      ballColor: 'rgb(200,200,200)',
      lineColor: this.lineColor,
      ballCount: count,
      linkDistance: distance,
      defaultRadius: 1,
      variantRadius: 2,
      defaultSpeed: 0.5,
      variantSpeed: 0.5
    }
    let w, h, ballList = [], tid, delay = 200
    let rgb = opts.lineColor.match(/\d+/g)
    function resizeReset () {
      w = canvasBody.width = window.innerWidth
      h = canvasBody.height = window.innerHeight
    }
    function checkDistance (x1, y1, x2, y2) {
      return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
    }
    function linkPoints (ball, ballList) {
      for (let i = 0, l = ballList.length; i < l; i++) {
        let distance = checkDistance(ball.x, ball.y, ballList[i].x, ballList[i].y)
        let opacity = 1 - distance / opts.linkDistance
        if (opacity > 0) {
          drawArea.lineWidth = 0.5
          drawArea.strokeStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${opacity})`
          drawArea.beginPath()
          drawArea.moveTo(ball.x, ball.y)
          drawArea.lineTo(ballList[i].x, ballList[i].y)
          drawArea.closePath()
          drawArea.stroke()
        }
      }
    }
    function deBouncer () {
      clearTimeout(tid)
      tid = setTimeout(function () {
        resizeReset()
      }, delay)
    }
    function setup () {
      resizeReset()
      for (let i = 0, l = opts.ballCount; i < l; i++) {
        ballList.push(new Ball())
      }
      window.requestAnimationFrame(loop)
    }
    function loop () {
      window.requestAnimationFrame(loop)
      drawArea.clearRect(0, 0, w, h)
      for (let i = 0, l = ballList.length; i < l; i++) {
        ballList[i].move()
        ballList[i].draw()
      }
      for (let i = 0, l = ballList.length; i < l; i++) {
        linkPoints(ballList[i], ballList)
      }
    }
    class Ball {
      constructor () {
        this.x = Math.random() * w
        this.y = Math.random() * h
        this.speed = opts.defaultSpeed + Math.random() * opts.variantSpeed
        this.angle = Math.floor(Math.random() * 360)
        this.color = opts.ballColor
        this.radius = opts.defaultRadius + Math.random() * opts.variantRadius
        this.vector = {
          x: Math.cos(this.angle) * this.speed,
          y: Math.sin(this.angle) * this.speed
        }
      }
      hitCheck () {
        if (this.x >= w || this.x <= 0) {
          this.vector.x *= -1
        }
        if (this.y >= h || this.y <= 0) {
          this.vector.y *= -1
        }
        if (this.x > w) this.x = w
        if (this.x < 0) this.x = 0
        if (this.y > h) this.y = h
        if (this.y < 0) this.y = 0
      }
      move () {
        this.hitCheck()
        this.x += this.vector.x
        this.y += this.vector.y
      }
      draw () {
        drawArea.beginPath()
        drawArea.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        drawArea.closePath()
        drawArea.strokeStyle = this.color
        drawArea.stroke()
      }
    }
    window.addEventListener('resize', function () {
      deBouncer()
    })
    resizeReset()
    setup()
  },
  methods: {
    ...mapMutations([
      'OPEN_LOGIN_DIALOG'
    ]),
    ...mapActions([
      'checkStatus',
      'getUserInfo'
    ]),
    openDialog () {
      // 如果本地有token,检验token,没有就打开登录窗口
      if (this.token) {
        this.checkStatus({userName: this.users.userName})
      } else {
        this.OPEN_LOGIN_DIALOG(true)
      }
    },
    closeDialog () {
      if (this.openLoginDialog) {
        this.OPEN_LOGIN_DIALOG(false)
      }
    },
    getInfo () {
      this.getUserInfo({userName: this.user}).then(res => {
        if (res === 1) {
          this.infoList = this.userInfo
        } else {
          this.infoList = res
        }
      })
    }
  }
}
</script>

<style lang="less" >
  @import '../assets/style/index.less';
  .page-container{
    display: flex;
    justify-content: center;
    width: inherit;
    height: inherit;

    .index-container{
      .fl-column;
      flex:0 1 700px;
      width: inherit;
      height: inherit;
    }

    #canvas{
      position: absolute;
      width: 100%;
      height: 100%;
      top:0;
      left:0;
      z-index:-1;
    }
  }
  /*用于假装遮罩层*/
  .fake{
    .fl-column;
    align-items: center;
    box-shadow: none;
    background-color: transparent;
    visibility: hidden;

    .dialogSrc{
      visibility: visible;
      width: 40vw;

      @media (max-width:950px){
        width: 50vw;
      }
      @media (max-width:480px){
        width:70vw;
      }
    }
  }

</style>





