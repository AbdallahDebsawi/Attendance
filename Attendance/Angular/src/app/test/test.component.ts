import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  Renderer2,
} from '@angular/core';
import { Chart, TooltipItem, ChartEvent, TooltipModel } from 'chart.js/auto';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css'],
})
export class TestComponent implements AfterViewInit {
  @ViewChild('barChart', { static: false })
  barChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('customTooltip', { static: false })
  customTooltip!: ElementRef<HTMLDivElement>;

  public chart!: Chart;

  private apiResponse = {
    labels: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ],
    values: [40, 60, 80, 100, 50, 70, 90, 30, 20, 110, 95, 85],
  };

  public fullLabels: string[] = [];
  public fullData: number[] = [];
  public itemsPerPage = 5;
  public currentPage = 0;
  private maxFullDataValue = 0;

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    this.loadDataFromApi();
  }

  private loadDataFromApi(): void {
    this.fullLabels = this.apiResponse.labels;
    this.fullData = this.apiResponse.values;

    // Compute max once before pagination
    this.maxFullDataValue = Math.max(...this.fullData);

    // Initialize chart after data is loaded
    this.initChart();
  }

  private initChart(): void {
    if (!this.barChart) {
      console.error('Canvas element not found!');
      return;
    }

    const ctx = this.barChart.nativeElement.getContext('2d');
    if (!ctx) {
      console.error('Unable to get canvas context!');
      return;
    }

    const { labels, datasets } = this.getPaginatedData();

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: { labels, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            max: this.maxFullDataValue + 10, // Fixed max
            ticks: {
              stepSize: Math.ceil(this.maxFullDataValue / 10), // Dynamic step size
            },
          },
        },
        plugins: {
          tooltip: {
            enabled: true,
            callbacks: {
              label: (tooltipItem: TooltipItem<'bar'>) =>
                `Data: ${tooltipItem.raw}`,
            },
            external: (context) => this.customTooltipHandler(context),
          },
        },
        onHover: (event: ChartEvent, elements) => {
          this.barChart.nativeElement.style.cursor =
            elements.length > 0 ? 'pointer' : 'default';
          if (elements.length === 0) this.hideCustomTooltip();
        },
      },
    });
  }

  private getPaginatedData() {
    const startIndex = this.currentPage * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    const paginatedValues = this.fullData.slice(startIndex, endIndex);

    return {
      labels: this.fullLabels.slice(startIndex, endIndex),
      datasets: [
        {
          label: 'Monthly Data',
          data: paginatedValues,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgb(54, 162, 235)',
          borderWidth: 1,
        },
      ],
    };
  }

  nextPage() {
    if ((this.currentPage + 1) * this.itemsPerPage < this.fullLabels.length) {
      this.currentPage++;
      this.updateChart();
    }
  }

  prevPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.updateChart();
    }
  }

  private updateChart() {
    const { labels, datasets } = this.getPaginatedData();
    this.chart.data.labels = labels;
    this.chart.data.datasets = datasets;
    this.chart.options.scales!.y!.max = this.maxFullDataValue + 10; // Keep max fixed
    this.chart.update();
  }

  private customTooltipHandler(context: { tooltip: TooltipModel<'bar'> }) {
    if (!this.customTooltip || !context.tooltip.opacity) {
      this.hideCustomTooltip();
      return;
    }

    const tooltip = context.tooltip;
    const position = this.barChart.nativeElement.getBoundingClientRect();

    this.renderer.setStyle(
      this.customTooltip.nativeElement,
      'left',
      `${position.left + tooltip.caretX}px`
    );
    this.renderer.setStyle(
      this.customTooltip.nativeElement,
      'top',
      `${position.top + tooltip.caretY}px`
    );
    this.renderer.setStyle(this.customTooltip.nativeElement, 'opacity', '1');
    this.customTooltip.nativeElement.innerHTML = `Value: ${tooltip.dataPoints[0].formattedValue}`;
  }

  private hideCustomTooltip() {
    if (this.customTooltip) {
      this.renderer.setStyle(this.customTooltip.nativeElement, 'opacity', '0');
    }
  }
}
