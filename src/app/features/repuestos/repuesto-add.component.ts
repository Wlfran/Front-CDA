import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RepuestoService } from '../../core/services/repuesto.service';
import { Repuesto } from '../../core/models/repuesto.model';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-repuesto-add',
    templateUrl: './repuesto-add.component.html',
    // styleUrl: './repuesto-add.component.css',
    imports: [
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        RouterLink
    ]
})
export class RepuestoAddComponent {
    loading = false;
    successMsg = '';
    errorMsg = '';

    repuestoForm!: FormGroup;

    constructor(private fb: FormBuilder, private repuestoService: RepuestoService) {
        this.repuestoForm = this.fb.group({
            codigo: ['', Validators.required],
            nombre: ['', [Validators.required, Validators.minLength(3)]],
            precioUnitario: [0, [Validators.required, Validators.min(1)]],
            stock: [0, [Validators.required, Validators.min(0)]],
        });
    }


    onSubmit() {
        if (this.repuestoForm.invalid) return;

        this.loading = true;
        this.successMsg = '';
        this.errorMsg = '';

        const repuesto: Repuesto = this.repuestoForm.value as Repuesto;

        this.repuestoService.createRepuesto(repuesto).subscribe({
            next: () => {
                this.successMsg = '✅ Repuesto creado correctamente';
                this.repuestoForm.reset();
                this.loading = false;
            },
            error: () => {
                this.errorMsg = '❌ Ocurrió un error al guardar';
                this.loading = false;
            }
        });
    }
}
