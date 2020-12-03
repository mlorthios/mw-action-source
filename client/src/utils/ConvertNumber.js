export default class UtilsConvertNumber {

    convert(n,d){x=(''+n).length,p=Math.pow,d=p(10,d)
        x-=x%3
        return Math.round(n*d/p(10,x))/d+" KMGTPE"[x/3]}

}
