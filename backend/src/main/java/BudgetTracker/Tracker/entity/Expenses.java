package BudgetTracker.Tracker.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
/**
 * Entity class representing an expense.
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "expenses")
public class Expenses {
    /**
     * The unique identifier for the expense.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long expensesId;
    /**
     * The description of the expense.
     */
    @Column(name = "expenses_description")
    private String expensesDescription;
    /**
     * The amount of the expense.
     */
    @Column(name = "expenses_amount")
    private int expensesAmount;
    /**
     * The date of the expense.
     */
    @Column(name = "date")
    private Instant expensesDate;

//    @ManyToOne
//    private Budget budget;
    /**
     * The budget associated with the expense.
     */
    @ManyToOne
    @JoinColumn(name = "budget_id", referencedColumnName = "budgetId")
    private Budget budget;



//    @ManyToOne
//    private User user;
}
