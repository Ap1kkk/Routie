package ru.ngtu.twosteps.jpa.repository;

import java.util.List;
import java.util.Optional;
import lombok.Getter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;
import ru.ngtu.twosteps.common.exceptions.ErrorText;
import ru.ngtu.twosteps.jpa.SoftDeletable;

public class EntityRepositoryFacade<E, ID, REPO extends JpaRepository<E, ID>> {

  @Getter
  private final REPO repository;
  private final Class<E> entityClass;

  public EntityRepositoryFacade(REPO repository, Class<E> entityClass) {
    this.repository = repository;
    this.entityClass = entityClass;
  }

  @Transactional
  public E getById(ID id) {
    return repository.findById(id)
        .orElseThrow(ErrorText.notFoundById(entityClass, id));
  }

  @Transactional
  public E getById(ID id, String idFieldName) {
    return repository.findById(id)
        .orElseThrow(ErrorText.notFoundBy(entityClass, idFieldName, id));
  }

  @Transactional
  public E getSoftDeletableById(ID id) {
    E entity = repository.findById(id)
        .orElseThrow(ErrorText.notFoundById(entityClass, id));
    if (entity instanceof SoftDeletable
        && ((SoftDeletable) entity).isDeleted()) {
      ErrorText.notFound(entityClass, "id", id);
    }
    return entity;
  }

  public E save(E entity) {
    return repository.save(entity);
  }

  public List<E> saveAll(Iterable<E> entities) {
    return repository.saveAll(entities);
  }

  public Optional<E> findById(ID id) {
    return repository.findById(id);
  }

  public List<E> findAll() {
    return repository.findAll();
  }

  public Page<E> findAll(Pageable pageable) {
    return repository.findAll(pageable);
  }

  public List<E> findAll(Sort sort) {
    return repository.findAll(sort);
  }

  public List<E> findAllById(Iterable<ID> ids) {
    return repository.findAllById(ids);
  }

  public long count() {
    return repository.count();
  }

  public void delete(E entity) {
    repository.delete(entity);
  }

  public void deleteById(ID id) {
    repository.deleteById(id);
  }

  public void deleteAll() {
    repository.deleteAll();
  }

  public void deleteAll(Iterable<? extends E> entities) {
    repository.deleteAll(entities);
  }

  public void deleteAllById(Iterable<? extends ID> ids) {
    repository.deleteAllById(ids);
  }
}
