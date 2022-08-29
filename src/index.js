/*  y轴不表示高度
 * 问题：1.label超出坐标轴仍然显示
 */
// Import LightningChartJS
const lcjs = require("@arction/lcjs");
const { createProgressiveTraceGenerator } = require("@arction/xydata");
// Extract required parts from LightningChartJS.
const {
  lightningChart,
  SolidFill,
  ColorRGBA,
  emptyLine,
  emptyFill,
  AxisTickStrategies,
  ColorPalettes,
  SolidLine,
  UIOrigins,
  UIElementBuilders,
  UILayoutBuilders,
  UIDraggingModes,
  AxisScrollStrategies,
  Themes,
} = lcjs;

const lc = lightningChart();

// Define an interface for creating span charts.
let spanChart;
// User side SpanChart logic.
{
  spanChart = () => {
    // Create a XY-Chart and add a RectSeries to it for rendering rectangles.
    const chart = lc
      .ChartXY({
        theme: Themes.lightNew,
      })
      .setTitle("The Sky at a glance")
      // .setMouseInteractions(false)
      // Disable default AutoCursor
      // .setAutoCursorMode(0)
      .setPadding({ right: "2" })
      .setAutoCursor((autoCursor) =>
        autoCursor.disposeTickMarkerY().setGridStrokeYStyle(emptyLine)
      );
    // 设置轴线 tooltips
    // chart.setAutoCursor(cursor => {
    //     console.log(cursor)
    //     cursor.disposeTickMarkerY()
    //     cursor.setGridStrokeYStyle(emptyLine)
    // })

    // .setAutoCursor((cursor) => {
    //     cursor
    //         .setResultTableAutoTextStyle(true)
    //         .disposeTickMarkerX()
    //         .setTickMarkerXAutoTextStyle(false)
    //         .setTickMarkerYAutoTextStyle(false)
    // })

    const rectangles = chart.addRectangleSeries();
    const axisX = chart
      .getDefaultAxisX()
      // .setMouseInteractions(false)
      // // // Hide default ticks, instead rely on CustomTicks.
      // .setTickStrategy(AxisTickStrategies.Empty)
      .setTickStrategy(AxisTickStrategies.Time)
      // Configure progressive ScrollStrategy.
      .setScrollStrategy(AxisScrollStrategies.progressive)
      // Set view to 1 minute.
      .setInterval(-1 * 60 * 1000, 0)
      .setAnimationScroll(false);

    const axisY = chart
      .getDefaultAxisY()
      .setMouseInteractions(false)
      .setAnimationScroll(false)
      .setTitle("")
      // Hide default ticks, instead rely on CustomTicks.
      .setTickStrategy(AxisTickStrategies.Empty);
    // .setInterval(0, 6000, false, false)
    // .setAnimationScroll(false)
    // .setAnimationsEnabled(false)
    let y = 0;
    // 自定义x轴
    // for (let i = 8; i <= 20; i++) {
    //     const label = i > 12 ? i - 12 + 'PM' : i + 'AM'
    //     axisX.addCustomTick(UIElementBuilders.AxisTick)
    //         .setValue(i)
    //         .setTickLength(4)
    //         .setGridStrokeLength(0)
    //         .setTextFormatter(_ => label)
    //         .setMarker(marker => marker
    //             .setTextFillStyle(new SolidFill({ color: ColorRGBA(170, 170, 170) }))
    //         )
    // }

    const figureHeight = 10;
    const figureThickness = 10;
    const figureGap = figureThickness * 0.5;

    let customYRange = figureHeight + figureGap * 1.6;

    let preTime = Date.now();

    const fitAxes = () => {
      // Custom fitting for some additional margins
      axisY.setInterval(y, figureHeight * 0.5);
    };
    const addCategory = (category) => {
      const categoryY = y;

      const addSpan = (min, max) => {
        // Add element for span labels
        // const { x, width } = rectDimensions;
        const rectDimensions = {
          x: min,
          y: categoryY - figureHeight,
          width: max - min,
          height: figureHeight,
        };
        const spanText = chart
          .addUIElement(UILayoutBuilders.Row, { x: axisX, y: axisY })
          .setOrigin(UIOrigins.Center)
          .setDraggingMode(UIDraggingModes.notDraggable)
          .setAutoDispose()
          .setPosition({
            x: (min + max) / 2,
            y: rectDimensions.y + 5,
          })
          .setBackground((background) =>
            background.setFillStyle(emptyFill).setStrokeStyle(emptyLine)
          );
        // console.dir(spanText.getAutoDispose())
        spanText.addElement(
          UIElementBuilders.TextBox.addStyler((textBox) =>
            textBox
              .setTextFont((fontSettings) => fontSettings.setSize(13))
              .setText("k" + Math.random().toFixed(5))
              .setTextFillStyle(new SolidFill().setColor(ColorRGBA(0, 0, 0)))
          )
        );

        // chart.addUIElement(subCategoryLabelBuilder, { x: axisX, y: axisY })
        //   // .setText('123')
        //   .setPosition({
        //     x: x + width / 2,
        //     y: y + height + 30,
        //   })

        // Return figure
        // Add custom tick for category

        fitAxes();

        return rectangles.add(rectDimensions);
      };

      axisY
        .addCustomTick(UIElementBuilders.AxisTick)
        .setValue(y - figureHeight * 0.5)
        // .setGridStrokeLength(0)
        // .setTextFormatter((_) => "")
        // .setMarker((marker) =>
        //   marker.setTextFillStyle(
        //     new SolidFill({ color: ColorRGBA(170, 170, 170) })
        //   )
        // );
      y -= figureHeight * 1.5;

      // Return interface for category.
      return {
        addSpan,
      };
    };
    // Return interface for span chart.
    return {
      addCategory,
    };
  };
}

// Use the interface for example.
const chart = spanChart();
const categories = [
  "5 chair room",
  "5 chair room",
  "5 chair room",
  "10 chair room",
  "10 chair room",
  "20 chair room",
  "Conference Hall",
].map((name) => chart.addCategory(name));
const colorPalette = ColorPalettes.flatUI(categories.length);
const fillStyles = categories.map(
  (_, i) => new SolidFill({ color: colorPalette(i) })
);
const strokeStyle = new SolidLine({
  fillStyle: new SolidFill({ color: ColorRGBA(0, 0, 0) }),
  thickness: 2,
});

const timeOrigin = Date.now();

// const cates = new Array(6).fill(1).map(_ => ) chart.addCategory("k" + Math.random().toFixed(5));

createProgressiveTraceGenerator()
  .setNumberOfPoints(60 * 1000)
  .generate()
  .toPromise()
  .then((seriesData) => {
    let dataAmount = 0;
    const pushData = () => {
      const seriesPoints = [
        {
          x: Date.now() - timeOrigin,
          y: seriesData[dataAmount % seriesData.length].y,
        },
      ];

      // series.add(seriesPoints)
      const now = Date.now();
      const y = Math.random() * 6000;
      const height = 30 + 30 * Math.random();
      const cate = categories[Math.trunc(Math.random() * 6)];
      cate.addSpan(
        now - timeOrigin, // 开始时间
        now - timeOrigin + (0.2 + Math.random() * 0.1) * 1000
      );
      // cate.addSpan({
      //     x: now - timeOrigin, // 开始时间
      //     width: (1 + Math.random() * 1) * 1000, // 时间段
      //     y: y + height,
      //     height, // 高
      // });
      dataAmount += 1;
      //   requestAnimationFrame(pushData);
      setTimeout(pushData, 1000);
    };
    pushData();
  });
