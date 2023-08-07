
export class MixLineChartOption{
    chart:any = { height: 300,type: 'line',};
    stroke:any= {width: [0, 4]};
    title: any= {text: 'Line'};
    dataLabels: any= {enabled: false, enabledOnSeries: [1]};
    labels: string[] = [];
    xaxis:any= {type: 'date'};
    yaxis: any[] = [{title: {text: 'Website Blog',},},{opposite: true,title: { text: 'Social Media'}}]    
}

export class LineChartOption{
    chart:any = {  height: 300,  type: 'line', zoom: { enabled: false}};
    dataLabels:any = { enabled: false};
    stroke:any= {curve: 'smooth', width:2};
    title: any= {text: 'Product Trends by Month',align: 'left'}
    grid: any=  {row: {colors: ['#f3f3f3', 'transparent'], opacity: 0.5},};
    xaxis:any=  {categories: [],}
}

export class BarChartOption{
    chart: any ={type: 'bar',height: 300};
    plotOptions: any ={bar: {borderRadius: 4,horizontal: true,}};
    dataLabels: any ={ enabled: false };
    xaxis: any = { categories: [], }
}

export class ColumChartOption{
    chart: any = {type: 'bar',height: 300};
    plotOptions: any = {
        bar: {
            horizontal: false,
            columnWidth: '55%',
            endingShape: 'rounded'
        },
    };
    dataLabels: any = {enabled: false};
    stroke: any = {show: true,width: 2,colors: ['transparent']};
    xaxis: any = { categories: [],}
    yaxis: any = { title: { text: '$ (thousands)' }};
    fill: any = { opacity: 1};
    tooltip: any = { y: { formatter: function (val:any) {return val}}}
}

export class PieChartOption{
    chart: any = {width: 300,type: 'pie',};
    labels: string[] = [];
    responsive: any = [{
        breakpoint: 480,
        options: {chart: {width: 200},legend: {position: 'bottom'}}}
    ]    
}

export class NamedSeries{
    name:string = "";
    type:string = "";
    data:number[] = []
}

export class BarSeries{
    data:number[] = []
}

export const toMixOption = (title: string)=>{
    const mixOpt = new MixLineChartOption()
    mixOpt.title.text = title
    return mixOpt 
}

export const toLinOption = (title: string)=>{
    const lineOpt = new LineChartOption()
    lineOpt.title.text = title
    return lineOpt
}

export const toSeries = (name:string, type:string)=>{
    const ns = new NamedSeries()
    ns.name = name
    ns.type = type
    return ns 
}

export const toBarOption =()=>{
    return new BarChartOption()
}

export const toPieOption =()=>{
    return new PieChartOption()
}

export const toBarSeries = ()=>{
    return new BarSeries()
}

export const toColumOption = (title:string)=>{
    const opt = new ColumChartOption();
    opt.yaxis.title.text = title
    return opt 
}
