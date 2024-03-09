<?php

namespace Application\abstracts;

use ReflectionClass;
use ReflectionException;

abstract class ModelDefaultFunctions
{
    /**
     * @throws ReflectionException
     */
    public function applyData($data, $reference): void
    {
        $ref = new ReflectionClass($reference);
        foreach ($ref->getProperties() as $property) {
            if (($property->class === $reference) && $property->isPublic() && array_key_exists($property->getName(), $data)) {
                $this->{$property->getName()} = $data[$property->getName()];
            }
        }
    }

    /**
     * @throws ReflectionException
     */
    public function toObject($reference)
    {
        $obj = array();
        $ref = new ReflectionClass($reference);
        foreach ($ref->getProperties() as $property) {
            if (($property->class === $reference) && $property->isPublic()) {
                $obj[$property->getName()] = $this->{$property->getName()};
            }
        }

        return $obj;
    }
}