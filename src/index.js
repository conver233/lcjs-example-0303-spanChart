/*
 * LightningChartJS example that showcases creation of a Span-chart.
 */
// Import LightningChartJS
const lcjs = require('@arction/lcjs')

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
    Themes
} = lcjs

const lc = lightningChart()

// Titles for span
const titles = [
    'Certificate exams',
    'Interview',
    'Trainee training program',
    'Department competition training sessions',
    'Internet security training',
    'Scrum meeting',
    'Development meeting',
    'First Aid training',
    'Conquering the silence - How to improve your marketing'
]

// Define an interface for creating span charts.
let spanChart
// User side SpanChart logic.
{
    spanChart = () => {
        // Create a XY-Chart and add a RectSeries to it for rendering rectangles.
        const chart = lc.ChartXY({
            // theme: Themes.darkGold 
        })
            .setTitle('Conference Room Reservations')
            .setMouseInteractions(false)
            // Disable default AutoCursor
            .setAutoCursorMode(0)
            .setPadding({ right: '2' })
        const rectangles = chart.addRectangleSeries()

        const axisX = chart.getDefaultAxisX()
            .setMouseInteractions(false)
            // Hide default ticks, instead rely on CustomTicks.
            .setTickStrategy(AxisTickStrategies.Empty)

        const axisY = chart.getDefaultAxisY()
            .setMouseInteractions(false)
            .setTitle('Conference Room')
            // Hide default ticks, instead rely on CustomTicks.
            .setTickStrategy(AxisTickStrategies.Empty)

        let y = 0
        for (let i = 8; i <= 20; i++) {
            const label = i > 12 ? i - 12 + 'PM' : i + 'AM'
            axisX.addCustomTick(UIElementBuilders.AxisTick)
                .setValue(i)
                .setTickLength(4)
                .setGridStrokeLength(0)
                .setTextFormatter(_ => label)
                .setMarker(marker => marker
                    .setTextFillStyle(new SolidFill({ color: ColorRGBA(170, 170, 170) }))
                )
        }


        const figureHeight = 10
        const figureThickness = 10
        const figureGap = figureThickness * .5
        const fitAxes = () => {
            // Custom fitting for some additional margins
            axisY.setInterval(y, figureHeight * .5)
        }

        let customYRange = figureHeight + figureGap * 1.6
        const addCategory = (category) => {
            const categoryY = y

            const addSpan = (i, min, max, index) => {
                // Add rect
                const rectDimensions = {
                    x: min,
                    y: categoryY - figureHeight,
                    width: max - min,
                    height: figureHeight
                }
                // Add element for span labels
                const spanText = chart.addUIElement(
                    UILayoutBuilders.Row,
                    { x: axisX, y: axisY }
                )
                    .setOrigin(UIOrigins.Center)
                    .setDraggingMode(UIDraggingModes.notDraggable)
                    .setPosition({
                        x: (min + max) / 2,
                        y: rectDimensions.y + 5,
                    })
                    .setBackground(background => background
                        .setFillStyle(emptyFill)
                        .setStrokeStyle(emptyLine)
                    )

                spanText.addElement(
                    UIElementBuilders.TextBox
                        .addStyler(
                            textBox =>
                                textBox.setTextFont(fontSettings => fontSettings.setSize(13)).setText(titles[index])
                                    .setTextFillStyle(new SolidFill().setColor(ColorRGBA(255, 255, 255)))

                        )

                )
                if (index != i) {
                    customYRange = customYRange + figureHeight + 1

                }
                fitAxes()
                // Return figure
                return rectangles.add(rectDimensions)
            }

            // Add custom tick for category
            axisY.addCustomTick(UIElementBuilders.AxisTick)
                .setValue(y - figureHeight * 0.5)
                .setGridStrokeLength(0)
                .setTextFormatter(_ => category)
                .setMarker(marker => marker
                    .setTextFillStyle(new SolidFill({ color: ColorRGBA(170, 170, 170) }))
                )
            y -= figureHeight * 1.5

            fitAxes()
            // Return interface for category.
            return {
                addSpan
            }
        }
        // Return interface for span chart.
        return {
            addCategory
        }
    }
}

// Use the interface for example.
const chart = spanChart()
const categories = ['5 chair room', '5 chair room', '5 chair room', '10 chair room', '10 chair room', '20 chair room', 'Conference Hall'].map((name) => chart.addCategory(name))
const colorPalette = ColorPalettes.flatUI(categories.length)
const fillStyles = categories.map((_, i) => new SolidFill({ color: colorPalette(i) }))
const strokeStyle = new SolidLine({
    fillStyle: new SolidFill({ color: ColorRGBA(0, 0, 0) }),
    thickness: 2
})
const spans = [
    [[10, 13], [16, 18]],
    [[8, 17]],
    [[12, 20]],
    [[9, 17]],
    [[10, 12], [15, 19]],
    [[11, 16]],
    [[9, 18]]
]

let index = 0;
spans.forEach((values, i) => {
    values.forEach((value, j) => {
        categories[i].addSpan(i, value[0], value[1], index)
            .setFillStyle(fillStyles[i])
            .setStrokeStyle(strokeStyle)
        index = index + 1
    }
    )
})


