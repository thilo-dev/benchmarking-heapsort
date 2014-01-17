

__author__=".dev"
__date__ ="$17.01.2014 09:55:30$"

if __name__ == "__main__":
    print "Hello World";


from random import *

class HeapSort:
    def __init__(self, size):
        self.size = size
        self.x = [0];
        for i in range(size):
            self.x.append(int(random()*16000000))
    
    def build(self):
        for i in range(int(self.size/2),0,-1):
            self.heapify(i)
            
    def heapify(self, i):
        l = 2*i
        r = (2*i)+1
        if (l<= self.size) and (self.x[l] > self.x[i]):
            largest = l
        else:
            largest = i
        if (r<= self.size) and (self.x[r] > self.x[largest]):
            largest = r
        if largest is not i:
            help = self.x[i]
            self.x[i] = self.x[largest]
            self.x[largest] = help
            self.heapify(largest)
    
    def sort(self):
        for i in range(self.size,1,-1):
            help = self.x[1]
            self.x[1] = self.x[i]
            self.x[i] = help
            self.size -=1
            self.heapify(1)
            
def main():
    heap()
   
def heap():
    t0 = time()
    y = HeapSort(1000000)
    tmid = time()
    y.build()
    tmid1 = time()
    y.sort()
    t1 = time()
    print "total: "+str(t1-t0)
    print "init: " +str(tmid-t0)
    print "build: "+str(tmid1-tmid)
    print "sort: "+str(t1-tmid1)
