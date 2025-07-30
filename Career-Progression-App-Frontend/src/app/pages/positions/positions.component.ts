import { Component, OnInit } from '@angular/core';
import { PositionService } from '../../services/position.service';
import { Position } from '../../model/position.model';
import { Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-positions',
  templateUrl: './positions.component.html',
  styleUrls: ['./positions.component.css'],
  imports: [MatIcon, CommonModule],
})
export class PositionsComponent implements OnInit {
  positions: Position[] = [];
  loading: boolean = false;

  constructor(
    private positionService: PositionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.loadPositions();
  }

  loadPositions(): void {
    this.positionService.getAllPositions().subscribe({
      next: (data) => ((this.positions = data), (this.loading = false)),
      error: (err) => console.error('Failed to load positions', err),
    });
  }

  onCreate(): void {
    this.router.navigate(['/positions/form']);
  }

  onEdit(positionId: number): void {
    this.router.navigate(['/positions/form'], {
      queryParams: { id: positionId },
    });
  }
}
