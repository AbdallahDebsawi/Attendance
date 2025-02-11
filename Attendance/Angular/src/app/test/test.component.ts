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
  private chart!: Chart;

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    if (!this.barChart) {
      console.error('Canvas element not found!');
      return;
    }

    const ctx = this.barChart.nativeElement.getContext('2d');
    if (!ctx) {
      console.error('Unable to get canvas context!');
      return;
    }

    const data = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'Attendance Dataset',
          data: [65, 59, 80, 81, 56, 55, 40],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 205, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(201, 203, 207, 0.2)',
          ],
          borderColor: [
            'rgb(255, 99, 132)',
            'rgb(255, 159, 64)',
            'rgb(255, 205, 86)',
            'rgb(75, 192, 192)',
            'rgb(54, 162, 235)',
            'rgb(153, 102, 255)',
            'rgb(201, 203, 207)',
          ],
          borderWidth: 1,
        },
      ],
    };

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
        plugins: {
          tooltip: {
            enabled: true,
            callbacks: {
              label: (tooltipItem: TooltipItem<'bar'>) => {
                return `Mock description: Data ${tooltipItem.raw}`;
              },
            },
            external: (context) => {
              this.customTooltipHandler(context);
            },
          },
        },
        onHover: (event: ChartEvent, elements) => {
          if (elements.length > 0) {
            this.barChart.nativeElement.style.cursor = 'pointer';
          } else {
            this.barChart.nativeElement.style.cursor = 'default';
            this.hideCustomTooltip();
          }
        },
      },
    });
  }

  private customTooltipHandler(context: { tooltip: TooltipModel<'bar'> }) {
    if (!this.customTooltip || !context.tooltip.opacity) {
      this.hideCustomTooltip();
      return;
    }

    const tooltip = context.tooltip;
    const position = this.barChart.nativeElement.getBoundingClientRect();

    // Set tooltip position
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

    // Set content
    this.customTooltip.nativeElement.innerHTML = `Custom Tooltip: ${tooltip.dataPoints[0].formattedValue}`;
  }

  private hideCustomTooltip() {
    if (this.customTooltip) {
      this.renderer.setStyle(this.customTooltip.nativeElement, 'opacity', '0');
    }
  }
}
