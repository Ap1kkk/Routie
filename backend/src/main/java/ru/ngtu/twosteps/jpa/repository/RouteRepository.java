package ru.ngtu.twosteps.jpa.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import ru.ngtu.twosteps.jpa.entity.route.Route;

import java.util.List;

@RepositoryRestResource(exported = false)
public interface RouteRepository extends JpaRepository<Route, Long>, JpaSpecificationExecutor<Route> {

    @Query("select MIN(r.id) from Route r")
    Long findMinimumId();

    @Query("select r from Route r order by r.likes desc limit :limit")
    List<Route> findPopular(int limit);
}