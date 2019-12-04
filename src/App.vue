<template>
    <div>
        <a-card title="串口控制">
            <a-row>
                <a-col :span="8">
                    <a-form>
                        <a-form-item label="串口">
                            <a-select style="width: 100%" v-model="path">
                                <a-select-option v-for="item in serialPortList" :key="item.path">
                                    {{item.path}}
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                        <a-form-item label="波特率">
                            <a-select style="width: 100%" v-model="config.baudRate">
                                <a-select-option v-for="item in [9600,19200]" :key="item">
                                    {{item}}
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                        <a-form-item label="数据位">
                            <a-select style="width: 100%" v-model="config.dataBits">
                                <a-select-option v-for="item in [8,7,6,5]" :key="item">
                                    {{item}}
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                        <a-form-item label="停止位">
                            <a-select style="width: 100%" v-model="config.stopBits">
                                <a-select-option v-for="item in [1,1.5,2]" :key="item">
                                    {{item}}
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                        <a-form-item label="校验位">
                            <a-select style="width: 100%" v-model="config.parity">
                                <a-select-option v-for="item in ['none','odd','even','mark','space']" :key="item">
                                    {{item}}
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                        <!--                        <a-form-item label="流控制">-->
                        <!--                            <a-select style="width: 100%">-->
                        <!--                                <a-select-option v-for="item in ['xon','xoff','xany','rtscts']" :key="item">-->
                        <!--                                    {{item}}-->
                        <!--                                </a-select-option>-->
                        <!--                            </a-select>-->
                        <!--                        </a-form-item>-->
                    </a-form>

                </a-col>
                <a-col offset="2" :span="14">
                    <div class="">
                        <a-button type="primary" :disabled="path==null || (path && port && true) " @click="open">打开
                        </a-button>
                        <a-button type="primary" :disabled="!port && true" @click="close">关闭</a-button>
                        <a-tag color="#f50" v-if="port && path && true">
                            {{path}}
                        </a-tag>
                        <br>
                        <!--                        {{config}}-->
                    </div>
                    <a-form>
                        <a-form-item label="接收数据">
                            <div
                                    id="res"
                            >
                                <a-list style="height: 100%" :dataSource="resData">
                                    <a-list-item slot="renderItem" style="margin-left: 2px"
                                                 slot-scope="item, index">
                                        <a-tag style="margin-left: 2px" v-if="showTime">
                                            {{moment(timeList[index]).format('hh:mm:ss')}}
                                        </a-tag>
                                        <a-tag color="pink"> {{index+1}}</a-tag>
                                        : {{receiveHex?item.toString('hex'):item}}
                                    </a-list-item>
                                </a-list>
                            </div>
                            <a-button type="primary" @click="resData=[] ,timeList=[]">清除</a-button>
                            <a-checkbox v-model="receiveHex">HEX</a-checkbox>
                            <a-checkbox v-model="showTime">显示时间</a-checkbox>
                        </a-form-item>
                        <a-form-item label="发送数据">
                            <a-textarea rows="4" v-model="sendText"></a-textarea>
                            <a-button type="primary" :disabled=" !port && true" @click="send">发送</a-button>
                            <a-checkbox v-model="sendHex">HEX</a-checkbox>
                        </a-form-item>
                    </a-form>
                </a-col>
            </a-row>
        </a-card>
    </div>
</template>

<script>
    import Serialport from 'serialport'
    import moment from 'moment'

    export default {
        name: 'App',
        data() {
            return {
                moment,
                port: null,
                serialPortList: [],
                resData: [],
                timeList: [],
                sendHex: false,
                receiveHex: false,
                showTime: true,
                sendText: '',
                path: null,
                config: {
                    autoOpen: false,
                    baudRate: 9600,
                    dataBits: 8,
                    stopBits: 1,
                    parity: 'none'
                }
            }
        },
        methods: {
            open() {
                const that = this
                this.port = new Serialport(this.path, that.config)
                this.port.open(function (err) {
                    if (err) {
                        return console.log('Error opening port: ', err.message)
                    }
                    // Because there's no callback to write, write errors will be emitted on the port:
                    that.port.write('main screen turn on')
                })
                // eslint-disable-next-line no-undef
                that.port.on('data', (res) => {
                    that.resData.push(res)
                    that.timeList.push(new Date())
                })
            },
            send() {
                const that = this
                that.port.write(Buffer.from(that.sendText, that.sendHex ? 'HEX' : 'ascii'))
            },

            close() {
                const that = this
                this.port.close((err) => {
                    if (err) {
                        console.log('err', err)
                    }
                    that.port = null
                })
            }

        },
        updated() {
            let divscll = document.getElementById('res')
            divscll.scrollTop = divscll.scrollHeight
        },

        beforeMount() {
            const that = this
            Serialport.list().then(res => {
                that.serialPortList = res
            })
        }
    }
</script>

<style scoped>
    #res {
        border: 1px solid #e8e8e8;
        border-radius: 4px;
        overflow: auto;
        height: 200px;
    }

    button {
        margin-right: 10px;
    }
</style>
