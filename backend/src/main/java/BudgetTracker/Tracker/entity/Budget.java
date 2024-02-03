package BudgetTracker.Tracker.entity;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "budget")
public class Budget {
    @Id
    @GeneratedValue
    private Long budgetId;

    @Column(name = "budget_description")
    private String budgetDescription;

    @Column(name = "budget_amount")
    private int budgetAmount;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "budget", cascade = CascadeType.ALL)
    private Set<Expenses> expenses = new HashSet<>();

    //method to calculate remaining budget
    @Transient
    public int calculateRemainingBudget() {
        int totalExpenses = expenses.stream().mapToInt(Expenses::getExpensesAmount).sum();
        return budgetAmount - totalExpenses;
    }
}
