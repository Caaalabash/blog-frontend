<template>
  <div class="chat-container">
    <div class="fl-row tim">
      <!--聊天列表区域-->
      <div class="msg-list my-scrollbar">
        <span v-for="(item,index) in chatlist"
             :key="index">
          <img :src="item.avatar?item.avatar:'/calabash32.png'"
            alt=""
            class="avatar"
            @click="_getChatData(item)"
            v-if="item.to">
        </span>
        <img src="../assets/add32.svg" alt="" class="avatar" @click="addChat">

        <el-popover
          placement="top"
          width="200"
          v-model="visible">
          <el-input  placeholder="添加聊天对象"
                     suffix-icon="el-icon-search"
                     v-model="input1"></el-input>
          <el-button type="primary" size="mini" @click="getChatObj" style="margin-top: 10px">确定</el-button>
        </el-popover>
      </div>

      <div class="fl-column msg-body">
        <!--聊天内容区域-->
        <div class="msg-data fl-column my-scrollbar" id="chat-content">
          <div v-for="(item,index) in message_filter" :key="index" class="msg-section">
            <div class="time-container">
              <span class="time" v-show="index%10===0">{{getTime(item.timeStamp)}}</span>
            </div>
            <div v-if="item.from ===userName" class="fl-row right" >
              <span class="msg-text" v-html="getHtml(item.content,true)" @click="play(item.content)"></span>
              <img :src="avatar" alt="" class="msg-avatar">
            </div>
            <div v-if="item.from === friend && item.to===userName" class="fl-row left">
              <img :src="friendsAvatar" alt="" class="msg-avatar">
              <span class="msg-text" v-html="getHtml(item.content,false)" @click="play(item.content)"></span>
            </div>
          </div>
        </div>

        <!--工具栏-->
        <div class="toolbar">
          <!--popover-->
          <el-popover
            class="emoji-popover"
            placement="top"
            :width="emojiBoxWidth"
            v-model="openEmoji">
           <div class="fl-row emojiBox">
             <i v-for="i in peopleEmoji" @click="addToMsg(i)">{{i}}</i>
           </div>
          </el-popover>
          <!--表情-->
          <img src="../assets/smile16.svg" alt="" class="emoji" @click="openEmoji = !openEmoji">
          <!--用于上传的隐藏组件-->
          <el-upload
            id="upload"
            style="display: none"
            action="/files"
            ref="upload"
            :httpRequest="upload"
            :before-upload="beforeAvatarUpload">
          </el-upload>
          <!--发送图片-->
          <img src="../assets/picture.svg" alt="" class="pic_btn" @click="uploadProxy">
          <!--播放语音的代码哦-->
          <audio controls="controls" id="audio" style="display: none" :autoplay="autoplay">
            <source :src="src" type="audio/mp3">
          </audio>
          <!--发送语音-->
          <img src="../assets/voice.svg" alt="" class="pic_btn" @click="startRecordVoice">
        </div>
        <!--输入区域-->
        <div class="msg-editor fl-column">
          <textarea name="" id="" v-model="msg" @keyup.enter="send"></textarea>
        </div>
        <!--发送按钮-->
        <div class="fl-row send">
          <div class="send_btn" @click.enter="send">发送</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import VueSocketio from 'vue-socket.io'
import store from '../store'
import socketio from 'socket.io-client'
import {mapGetters,mapActions} from 'vuex'
import {timestampToTime} from '../lib/lib'
import {getRecordFile,startRecord,stopRecord} from '../lib/record'
Vue.use(VueSocketio, socketio(process.env.VUE_APP_SOCKET), store)

export default {
  name: "Chat",
  data(){
    return{
      chatlist:[],
      friendsAvatar:'',
      friend:'',
      msg:'',
      visible:false,
      openEmoji:false,
      input1:'',
      peopleEmoji : '😄 😃 😀 😊 ☺ 😉 😍 😘 😚 😗 😙 😜 😝 😛 😳 😁 😔 😌 😒 😞 😣 😢 😂 😭 😪 😥 😰 😅 😓 😩 😫 😨 😱 😠 😡 😤 😖 😆 😋 😷 😎 😴 😵 😲 😟 😦 😧 😈 👿 😮 😬 😐 😕 😯 😶 😇 😏 😑 👲 👳 👮 👷 💂 👶 👦 👧 👨 👩 👴 👵 👱 👼 👸 😺 😸 😻 😽 😼 🙀 😿 😹 😾 👹 👺 🙈 🙉 🙊 💀 👽 💩 🔥 ✨ 🌟 💫 💥 💢 💦 💧 💤 💨 👂 👀 👃 👅 👄 👍 👎 👌 👊 ✊ ✌ 👋 ✋ 👐 👆 👇 👉 👈 🙌 🙏 ☝ 👏 💪 🚶 🏃 💃 👫 👪 👬 👭 💏 💑 👯 🙆 🙅 💁 🙋 💆 💇 💅 👰 🙎 🙍 🙇 🎩 👑 👒 👟 👞 👡 👠 👢 👕 👔 👚 👗 🎽 👖 👘 👙 💼 👜 👝 👛 👓 🎀 🌂 💄 💛 💙 💜 💚 ❤ 💔 💗 💓 💕 💖 💞 💘'.split(' '),
      emojiBoxWidth:window.innerWidth<767? 200:400,
      file:'',
      audio:'',
      isRecord:false,
      src:'',
      autoplay:false
    }
  },
  computed:{
    ...mapGetters([
      'userName',
      'message',
      'avatar',
      'token'
    ]),
    message_filter(){
      return this.message.filter((item)=>{
        return item.chatid === [this.userName,this.friend].sort().join('_')
      })
    }
  },
  sockets:{
    connect(){
      console.log('socket connected')
    },
    recvMsg(val){ }
  },
  watch:{
    'message'(){
      this.$nextTick(()=>{
        let el = document.getElementById('chat-content')
        el.scrollTop = el.scrollHeight
      })
    }
  },
  created(){
    this.$api.getChatList({user:this.userName}).then(res=>{
      if(res.errno===0){
        this.chatlist = res.data
        this._getChatData(this.chatlist[0])
      }
    })
  },
  mounted(){
    this.$socket.emit('connect','test参数'); //在这里触发connect事件
    this.$socket.emit('online',this.userName)
  },
  methods:{
    ...mapActions([
      'socket_sendMsg',
      'getChatData'
    ]),
    emitMsg(content){
      this.$socket.emit('sendMsg',{
        from:this.userName,
        to:this.friend,
        timeStamp:new Date().getTime(),
        content:content
      })
      this.socket_sendMsg({
        from:this.userName,
        to:this.friend,
        content:content,
        timeStamp:new Date().getTime(),
        chatid:[this.friend,this.userName].sort().join('_')
      })
    },
    send(){
      if(this.msg===''){
        this.$message.error('不能发送空消息')
        return
      }
      if(this.friend===''){
        this.$message.error('没有确定聊天对象')
        return
      }
      this.emitMsg(this.msg)
      this.msg = ''
    },
    _getChatData(item){
      let chatid = [item.to,this.userName].sort().join('_')
      this.getChatData({chatid})
      this.friendsAvatar = item.avatar ? item.avatar : '/calabash32.png'
      this.friend = item.to
    },
    addChat(){
      this.visible = !this.visible
    },
    getChatObj(){
      this.$api.addChatObj({user:this.input1}).then(res=>{
        if(res.errno===0){
          this.chatlist.push(res.data)
          this.visible = false
        }
      })
    },
    getTime(timeStamp){
      if(/\d+/.test(timeStamp)){
        let [date,time] = timestampToTime(timeStamp).split(' ')
        let today = new Date().toLocaleString('zh').split(' ')[0]
        if(today === date){
          return time
        }
        return `${date} ${time}`
      }
      return ''
    },
    addToMsg(i){
      this.msg += i
      this.openEmoji = false
    },
    uploadProxy(){
      document.getElementById('upload').getElementsByTagName('input')[0].click()
    },
    upload () {
      let formData = new FormData()
      formData.append('chat', this.file)
      this.$api.uploadChatPic(formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': this.token,
          'userName': this.userName
        }
      }).then(res => {
        if (res.data) {
          let content = `<img src="${res.data}" style="width:100%;height:100%" />`
          this.emitMsg(content)
        }
        this.file = ''
      })
    },
    uploadAudio(){
      let formData = new FormData()
      formData.append('audio', this.audio)
      this.$api.uploadVoiceMsg(formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': this.token,
          'userName': this.userName
        }
      }).then(res => {
        if (res.data) {
          let content =
            `[media]${res.data}`
          this.emitMsg(content)
        }
        this.audio = ''
      })
    },
    beforeAvatarUpload (file) {
      const isImage = file.type.includes('image')
      const isLt4M = file.size / 1024 / 1024 < 4
      if (!isImage) {
        this.$message.error('只能上传图片')
        return false
      }
      if (!isLt4M) {
        this.$message.error('上传图片大小不能超过 4MB!')
        return false
      }
      this.file = file
      return true
    },
    startRecordVoice(){
      if(!this.isRecord){
        this.isRecord = true
        startRecord()
        this.$notify({
          title: '提示',
          message: '正在录音',
          duration: 1000
        });
      }else{
        let _this = this
        this.isRecord =false
        this.$notify({
          title: '提示',
          message: '录音完毕',
          duration: 1000
        });
        stopRecord(function(){
          _this.audio = getRecordFile()
          _this.uploadAudio()
        });
      }
    },
    getHtml(content,side){
      return /\[media]/.test(content)
        ? side
          ? `<img src="https://blog.calabash.top/voice_right.svg">`
          : `<img src="https://blog.calabash.top/voice_left.svg">`
        : content
    },
    play(src){
      this.autoplay = false
      if(/\[media]/.test(src)){
        this.src = src.split(']')[1]
        document.getElementById('audio').load()
        this.autoplay = true
      }
    }
  }
}
</script>

<style scoped lang="less">
  @import '../assets/style/index.less';

  .chat-container{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;

    .tim{
      flex:0 1 800px;
      height: 700px;
      box-sizing: padding-box;
      border:1px solid rgba(100,100,100,.3);

      .msg-list{
        width:65px;
        padding: 10px 5px;
        background-color: rgb(250,250,250);
        overflow-y: scroll;

        .avatar{
          height: 50px;
          width: 50px;
          border-radius: 50%;
          cursor: pointer;
        }
        img:hover{
          background-color: rgb(235,235,235);
        }
      }

      .msg-body{
        width: 100%;
        height: 100%;

        .msg-data{
          flex:15;
          overflow-y: scroll;
          .msg-section{
            margin:10px 0;
            .time-container{
              margin: 0 auto;
              text-align: center;
              .time{
                color:rgb(100,100,100)
              }
            }
            .right,.left{
              min-height: 45px;
              .msg-avatar{
                height: 35px;
                width: 35px;
                border-radius: 50%;
              }
              .msg-text{
                display: flex;
                align-self: center;
                position:relative;
                padding: 5px 10px;
                border-radius: 8px;
                min-height: 32px;
                line-height: 32px;
                max-width: 50%;
                word-break: break-all;
                img{
                  max-width: 100%;
                  max-height: 100%;
                }
              }

            }
            .right{
              justify-content: flex-end;
              .msg-text{
                background-color: rgb(38,141,245);
                color: white;
                margin-right:15px;
                &::after{
                  position: absolute;
                  top:10px;
                  right:-10px;
                  content:'';
                  height: 0;
                  width: 0;
                  border:5px solid transparent;
                  border-left-color: rgb(38,141,245);
                }
              }
            }
            .left{
              justify-content: flex-start;
              .msg-text{
                background-color: rgb(238,238,238);
                color: black;
                margin-left:15px;
                &::before{
                  position: absolute;
                  top:10px;
                  left:-10px;
                  content:'';
                  height: 0;
                  width: 0;
                  border:5px solid transparent;
                  border-right-color: rgb(238,238,238);
                }
              }

            }
          }
        }
        .toolbar{
          flex:0 0 36px;
          border-top:1px solid rgba(0,0,0,.2);
          display: flex;
          position: relative;
          margin: 0 10px;
          align-items: center;

          .emoji-popover{
            position: absolute;
            left:0;
            top:-212px;
            .emojiBox{
              flex-wrap: wrap;
              word-break: break-all;

              i{
                width: 20px;
                height: 20px;
                cursor: pointer;
              }
            }

          }
          .emoji{
            width: 24px;
            height: 24px;
            margin: 0 5px;
          }
          .pic_btn{
            width: 22px;
            height: 22px;
            margin: 0 5px;
          }
        }
        .msg-editor{
          flex: 3;
          textarea{
            border:none;
            resize: none;
            outline: none;
            background-color: white;
            height:100px;
            width: 95%;
          }
        }
        .send{
          justify-content: flex-end;
          font-size: @timeFont;
          .send_btn{
            background-color: #3a8ee6;
            line-height: 27px;
            width: 60px;
            border-radius: 2px;
            text-align: center;
            color: white;
            cursor: pointer;
          }
        }

      }
    }
    @media (max-width: 767px) {
      .tim{
        flex-direction: column;
        height: 100%;
        .msg-list{
          overflow-y: hidden;
          flex-direction: row;
          flex-flow: nowrap;
          justify-content: flex-start;
          width: 100%;
          height: 40px;
          flex-shrink: 0;
          .avatar{
            width: 35px;
            height: 35px;
          }
        }
        .msg-body{
          .toolbar{
            .emoji-popover{
              width: 240px;
              top:-400px
            }
          }
        }
        .send_btn{
          margin:0 20px 20px 0;
        }
      }
    }
  }

</style>
