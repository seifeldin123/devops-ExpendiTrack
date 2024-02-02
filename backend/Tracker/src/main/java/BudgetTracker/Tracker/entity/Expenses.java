package BudgetTracker.Tracker.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "expenses")
public class Expenses {
    @Id
    @GeneratedValue
    private Long expensesId;

    @Column(name = "expenses_description")
    private String expensesDescription;

    @Column(name = "expenses_amount")
    private int expensesAmount;

    @Column(name = "date")
    private Instant expensesDate;

    @ManyToOne
    private Budget budget;
}
