package BudgetTracker.Tracker.entity;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;
/**
 * Entity class representing a budget.
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "budgets", uniqueConstraints = @UniqueConstraint(columnNames = {"budget_description", "user_id"}))
public class Budget {
    /**
     * The unique identifier for the budget.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long budgetId;
    /**
     * The description of the budget.
     */
    @Column(name = "budget_description")
    private String budgetDescription;
    /**
     * The amount allocated for the budget.
     */
    @Column(name = "budget_amount")
    private int budgetAmount;
    /**
     * The user to whom the budget belongs.
     */
    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;
}
