<template>
  <div class="chat-container">
    <div class="fl-row tim">
      <!-- 聊天列表区域 -->
      <div class="msg-list my-scrollbar">
        <img v-for="(chatUser, index) in chatList"
             v-if="chatUser.to"
             :key="index"
             :src="chatUser.avatar || '/calabash32.png'"
             class="avatar"
             @click="setCurrentChatUser(chatUser)"
        >
        <i class="avatar iconfont icon-adduser" @click="toggleVisible"></i>
        <el-popover placement="top" width="200" v-model="addUserPopoverVisible">
          <el-input v-model="newUserName" placeholder="添加聊天对象" suffix-icon="el-icon-search"></el-input>
          <el-button type="primary" size="mini" @click="getChatObj" style="margin-top: 10px">确定</el-button>
        </el-popover>
      </div>

      <div class="fl-column msg-body">
        <!-- 聊天内容区域 -->
        <div class="msg-data fl-column my-scrollbar" id="chat-content">
          <div v-for="(payload, index) in message_filter" :key="index" class="msg-section">
            <div class="time-container">
              <span class="time" v-show="index % 10 === 0">{{ getTime(payload.timeStamp) }}</span>
            </div>
            <div v-if="payload.from === userName" class="fl-row right" >
              <span class="msg-text" v-html="getHtml(payload.content, true)" @click="play(payload.content)"></span>
              <img :src="avatar" alt="" class="msg-avatar">
            </div>
            <div v-if="payload.from === currentChatUser.to && payload.to === userName" class="fl-row left">
              <img :src="currentChatUser.avatar" class="msg-avatar">
              <span class="msg-text" v-html="getHtml(payload.content, false)" @click="play(payload.content)"></span>
            </div>
          </div>
        </div>

        <!-- 工具栏 -->
        <div class="toolbar">
          <!-- popover -->
          <el-popover
            class="emoji-popover"
            placement="top"
            v-model="emojiPopoverVisible">
           <div class="fl-row emojiBox">
             <i v-for="emoji in emojiList" @click="addEmoji(emoji)">{{ emoji }}</i>
           </div>
          </el-popover>
          <!-- 表情 -->
          <i class="emoji iconfont icon-smileface" @click="emojiPopoverVisible = !emojiPopoverVisible"></i>
          <!-- 用于上传的隐藏组件 -->
          <el-upload
            id="upload"
            style="display: none"
            action="/files"
            ref="upload"
            :httpRequest="sendPicture"
            :before-upload="beforeAvatarUpload">
          </el-upload>
          <!-- 发送图片 -->
          <i class="pic_btn iconfont icon-image" @click="uploadProxy"></i>
          <!-- 播放语音 -->
          <audio controls="controls" id="audio" style="display: none" :autoplay="autoplay">
            <source :src="src" type="audio/mp3">
          </audio>
          <!-- 发送语音 -->
          <i class="pic_btn iconfont icon-microphone" @click="startRecordVoice"></i>
        </div>
        <!-- 输入区域 -->
        <div class="msg-editor fl-column">
          <textarea v-model="msg" @keyup.enter="sendText"></textarea>
        </div>
        <!-- 发送按钮 -->
        <div class="fl-row sendText">
          <div class="send_btn" @click.enter="sendText">发送</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import VueSocketIO from 'vue-socket.io'
import store from '@/store'
import SocketIO  from 'socket.io-client'
import { mapGetters, mapActions } from 'vuex'
import { timestampToTime, EMOJI } from '@/lib/lib'
import { getRecordFile, startRecord, stopRecord } from '@/lib/record'

Vue.use(new VueSocketIO({
  connection: SocketIO(process.env.VUE_APP_HOST, {
    path: '/socket'
  }),
  vuex: { store }
}))

export default {
  name: 'chat',
  data: () => ({
    chatList: [],
    currentChatUser: {},
    msg: '',
    file: '',
    audio: '',
    newUserName: '',
    src: '',
    isRecord: false,
    autoplay: false,
    // UI
    emojiList: EMOJI,
    addUserPopoverVisible: false,
    emojiPopoverVisible: false,
  }),
  computed: {
    ...mapGetters([
      'userName',
      'message',
      'avatar',
    ]),
    chatid() {
      return this.currentChatUser && ([this.currentChatUser.to, this.userName].sort().join('_'))
    },
    message_filter() {
      return this.message.filter(item => item.chatid === this.chatid)
    }
  },
  sockets: {
    connect() {
      console.log('socket connected')
    },
    recvMsg(data) {
      this.socketRecvMsg(data)
    }
  },
  watch: {
    userName: {
      handler(val) {
        if (!val) return
        this.$api.getChatList({ user: this.userName }).then(res => {
          if (res.errno === 0) {
            this.chatList = res.data
            this.setCurrentChatUser(this.chatList[0])
          }
        })
        this.$socket.emit('online', this.userName)
      },
      immediate: true
    },
    message() {
      this.$nextTick(() => {
        const el = document.getElementById('chat-content')
        el.scrollTop = el.scrollHeight
      })
    }
  },
  methods: {
    ...mapActions([
      'socketSendMsg',
      'socketRecvMsg',
      'getChatData'
    ]),
    emitMsg(content) {
      const payload = {
        from: this.userName,
        to: this.currentChatUser.to,
        timeStamp: new Date().getTime(),
        content
      }
      this.$socket.emit('sendMsg', payload)
      this.socketSendMsg({ chatid: this.chatid, ...payload })
      this.msg = ''
      this.file = ''
      this.audio = ''
    },
    sendText() {
      if (!this.msg) {
        this.$message.info('不能发送空消息')
        return
      }
      if(!this.currentChatUser) {
        this.$message.info('没有确定聊天对象')
        return
      }
      this.emitMsg(this.msg)
    },
    async sendPicture() {
      const formData = new FormData()
      formData.append('chat', this.file)

      const res = await this.$api.uploadChatPic(formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'userName': this.userName
        }
      })
      if (res.data) {
        const content = `<img src="${res.data}" style="width:100%;height:100%" alt=""/>`
        this.emitMsg(content)
      }
    },
    async sendVoice() {
      const formData = new FormData()
      formData.append('audio', this.audio)

      const res = await this.$api.uploadVoiceMsg(formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'userName': this.userName
        }
      })
      if (res.data) {
        const content = `[media]${res.data}`
        this.emitMsg(content)
      }
    },
    setCurrentChatUser(user) {
      !user.avatar && (user.avatar = '/calabash32.png')
      this.currentChatUser = user
      this.getChatData({ chatid: this.chatid })
    },
    toggleVisible() {
      this.addUserPopoverVisible = !this.addUserPopoverVisible
    },
    async getChatObj() {
      const res = await this.$api.addChatObj({ user: this.newUserName })
      if (res.errno === 0) {
        this.chatList.push(res.data)
        this.addUserPopoverVisible = false
      }
    },
    getTime(timeStamp) {
      if (!/\d+/.test(timeStamp)) return ''
      
      const [date, time] = timestampToTime(timeStamp).split(' ')
      const today = new Date().toLocaleString('zh').split(' ')[0]
      if (today === date) return time
      return `${date} ${time}`
    },
    addEmoji(emoji) {
      this.msg += emoji
      this.emojiPopoverVisible = false
    },
    uploadProxy() {
      document.getElementById('upload').getElementsByTagName('input')[0].click()
    },
    beforeAvatarUpload(file) {
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
    startRecordVoice() {
      if (!this.isRecord) {
        this.isRecord = true
        this.$notify({
          title: '提示',
          message: '正在录音',
          duration: 1000
        })
        startRecord()
      } else {
        this.isRecord = false
        this.$notify({
          title: '提示',
          message: '录音完毕',
          duration: 1000
        });
        stopRecord(() => {
          this.audio = getRecordFile()
          this.sendVoice()
        })
      }
    },
    getHtml(content, side) {
      return /\[media]/.test(content)
        ? side
          ? `<img src="https://blog.calabash.top/voice_right.svg">`
          : `<img src="https://blog.calabash.top/voice_left.svg">`
        : content
    },
    play(src) {
      this.autoplay = false
      if (/\[media]/.test(src)) {
        this.src = src.split(']')[1]
        document.getElementById('audio').load()
        this.autoplay = true
      }
    }
  }
}
</script>

<style scoped lang="less">
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
          font-size: 50px;
          border-radius: 50%;
          cursor: pointer;
          color: rgba(0, 0, 0, .5);
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
            width: 400px;
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
          .iconfont {
            margin: 0 5px;
            font-size: 20px;
            cursor: pointer;
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
        .sendText{
          justify-content: flex-end;
          font-size: 12px;
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
            font-size: 35px;
          }
        }
        .msg-body{
          .toolbar{
            .emoji-popover{
              width: 200px;
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
