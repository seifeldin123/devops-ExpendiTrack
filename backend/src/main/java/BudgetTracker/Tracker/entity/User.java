package BudgetTracker.Tracker.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
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
@Table(name = "app_users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_name", unique = true)
    private String name;

    @Column(name = "user_email", unique = true)
    private String email;

    @JsonIgnoreProperties("user")
    @OneToMany(mappedBy = "user",cascade = CascadeType.ALL)
    private Set<Budget> budgets = new HashSet<>();
}
