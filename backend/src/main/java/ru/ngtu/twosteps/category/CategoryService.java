package ru.ngtu.twosteps.category;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.ngtu.twosteps.jpa.BaseEntity;
import ru.ngtu.twosteps.common.exceptions.classes.data.EntityNotFoundException;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import ru.ngtu.twosteps.jpa.entity.Category;
import ru.ngtu.twosteps.jpa.repository.CategoryRepository;

/**
 * @author Egor Bokov
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository repository;
    private final CategoryValidator validator;
    private final CategoryMapper mapper;

    @Transactional(readOnly = true)
    public List<Category> getByIds(List<Long> ids) {
        List<Category> allByIds = repository.findAllById(ids);
        List<Long> foundIds = allByIds.stream().map(BaseEntity::getId).toList();

        if(allByIds.size() != ids.size()) {
            Set<Long> missingIds = ids
                    .stream()
                    .filter(id -> !foundIds.contains(id))
                    .collect(Collectors.toSet());
            throw new EntityNotFoundException(Category.class, missingIds);
        }
        return allByIds;
    }

    public List<Category> getAll() {
        return repository.findAll();
    }

    @Transactional
    public Category create(CategoryDto dto) {
        log.info("[Category]: creating by dto: {}", dto);
        validator.validateToCreate(dto);
        Category entity = mapper.toEntity(dto);
        return repository.save(entity);
    }

    @Transactional
    public Category update(CategoryDto dto) {
        log.info("[Category]: updating by dto: {}", dto);
        validator.validateToUpdate(dto);
        Category entity = mapper.toEntity(dto);
        return repository.save(entity);
    }

    @Transactional
    public void delete(Long id) {
        log.info("[Category]: deleting by id: {}", id);
        Category entity = validator.throwIfNotExists(id);
        repository.delete(entity);
    }
}
