
export class MixLineChartOption{
    chart:any = { height: 350,type: 'line',};
    stroke:any= {width: [0, 4]};
    title: any= {text: 'Line'};
    dataLabels: any= {enabled: false};
    labels: string[] = [];
    xaxis:any= {type: 'date'};
    yaxis: any[] = [{title: {text: 'Website Blog',},},{opposite: true,title: { text: 'Social Media'}}]    
}

export class LineChartOption{
    chart:any = {  height: 350,  type: 'line', zoom: { enabled: false}};
    dataLabels:any = { enabled: false};
    stroke:any= {curve: 'smooth', width:2};
    title: any= {text: 'Product Trends by Month',align: 'left'}
    grid: any=  {row: {colors: ['#f3f3f3', 'transparent'], opacity: 0.5},};
    xaxis:any=  {categories: [],}
}

export class NamedSeries{
    name:string = "";
    type:string = "";
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
